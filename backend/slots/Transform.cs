/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Threading.Tasks;
using Markdig;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;
using magic.node.extensions.hyperlambda;

namespace backend.slots
{
    /// <summary>
    /// [magic.publishing.transform] slot transforming a page object to its output by
    /// applying [content] and other parameters, into the specified [template].
    /// </summary>
    [Slot(Name = "wait.magic.publishing.transform")]
    public class Transform : ISlotAsync
    {
        /// <summary>
        /// Handles the signal for the class.
        /// </summary>
        /// <param name="signaler">Signaler used to signal the slot.</param>
        /// <param name="input">Root node for invocation.</param>
        /// <returns>An awaitable task.</returns>
        public async Task SignalAsync(ISignaler signaler, Node input)
        {
            /*
             * Retrieving and unrolling any plugins and arguments found in [template].
             * Notice, the template is assumed to be HTML and not Markdown.
             */
            var template = input.Children.First(x => x.Name == "template").Get<string>();
            template = UnrollArguments(input, template);
            template = await UnrollPluginsAsync(signaler, template, input, false);

            /*
             * Retrieving and unrolling any plugins and arguments found in [content].
             * Notice, the template is assumed to be Markdown and not HTML.
             */
            var content = input.Children.First(x => x.Name == "content").Get<string>();
            content = UnrollArguments(input, content);
            content = await UnrollPluginsAsync(signaler, content, input, true);

            // Replacing content in template with item's content.
            var result = template.Replace("![[content]]!", content);

            // Returning results to caller.
            input.Value = result;
        }

        #region [ -- Private helper methods -- ]

        string UnrollArguments(Node node, string content)
        {
            /*
             * Substitution of everything except [content], allowing
             * to extend the SQL query actually selecting the document
             * with additional fields, to easily extend the substitution
             * process.
             */
            foreach (var idx in node.Children.Where(x => x.Name != "content"))
            {
                content = content.Replace(
                    "![[" + idx.Name + "]]!", 
                    Convert.ToString(idx.Value, CultureInfo.CurrentUICulture));
            }
            return content;
        }

        /*
         * Unrolls plugins referenced in specified content.
         */
        async Task<string> UnrollPluginsAsync(
            ISignaler signaler, 
            string content, 
            Node node,
            bool isMarkdown)
        {
            var result = new StringBuilder();
            var buffer = new StringBuilder();
            using (var reader = new StringReader(content))
            {
                var line = reader.ReadLine();
                while(line != null)
                {
                    // TODO: Implement true parsing, to allow for having plugins inside of e.g. attributes, etc.
                    if (line == "![[")
                    {
                        /*
                         * Hyperlambda content, reading until we find the end of it, parsing, 
                         * evaluating, and adding results of evaluation into buffer.
                         *
                         * Making sure we first append content found so far in StringReader.
                         */
                        if (isMarkdown)
                            result.Append(Markdown.ToHtml(buffer.ToString()));
                        else
                            result.Append(buffer.ToString());
                        buffer.Clear();
                        line = reader.ReadLine(); // Discarding opening "![[" parts.
                        while(line != "]]!")
                        {
                            buffer.Append(line).Append("\r\n");
                            line = reader.ReadLine();
                        }

                        /*
                         * Notice, passing in all arguments as [.arguments] to all
                         * inline Hyperlambda plugin sections.
                         */
                        var lambda = new Parser(buffer.ToString()).Lambda();
                        lambda.Add(new Node(".arguments", null, node.Children.Select(x => x.Clone())));
                        buffer.Clear();
                        var evalResult = new Node();
                        await signaler.ScopeAsync(
                            "slots.result",
                            evalResult,
                            async () => await signaler.SignalAsync("wait.eval", lambda));

                        /*
                         * Assuming the plugin section returned some sort of inclusion,
                         * effectively being server side "document.write" logic.
                         */
                        result.Append(evalResult.Get<string>());
                    }
                    else
                    {
                        // Normal content.
                        buffer.Append(line).Append("\r\n");
                    }
                    line = reader.ReadLine();
                }
                if (isMarkdown)
                    result.Append(Markdown.ToHtml(buffer.ToString()));
                else
                    result.Append(buffer.ToString());
            }
            return result.ToString();
        }

        #endregion
    }
}