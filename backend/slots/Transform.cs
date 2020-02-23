/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Configuration;
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
    [Slot(Name = "magic.publishing.transform")]
    public class Transform : ISlot
    {
        IConfiguration _configuration;

        public Transform(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            // Retrieving and unrolling any plugins and arguments found in [template].
            var template = input.Children.First(x => x.Name == "template").Get<string>();
            template = UnrollArguments(input, template);
            template = UnrollPlugins(signaler, template, input, false);

            // Retrieving and unrolling any plugins found in [content].
            var content = input.Children.First(x => x.Name == "content").Get<string>();
            content = UnrollArguments(input, content);
            content = UnrollPlugins(signaler, content, input, true);

            // Replacing content in template with item's content.
            var result = template.Replace("![[content]]!", content);

            // Returning results to caller.
            input.Value = result;
        }

        #region [ -- Private helper methods -- ]

        string UnrollArguments(Node node, string content)
        {
            foreach (var idx in node.Children.Where(x => x.Name != "content"))
            {
                content = content.Replace("![[" + idx.Name + "]]!", idx.Get<string>());
            }
            return content;
        }

        /*
         * Unrolls plugins referenced in specified content.
         */
        string UnrollPlugins(
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
                        var lambda = new Parser(buffer.ToString()).Lambda();
                        lambda.Add(new Node(".arguments", null, node.Children.Select(x => x.Clone())));
                        buffer.Clear();
                        var evalResult = new Node();
                        signaler.Scope("slots.result", evalResult, () =>
                        {
                            signaler.Signal("eval", lambda);
                        });                        
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