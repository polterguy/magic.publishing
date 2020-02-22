/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Globalization;
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
        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            var template = input.Children.First(x => x.Name == "template").Get<string>();
            var content = input.Children.First(x => x.Name == "content").Get<string>();
            var title = input.Children.First(x => x.Name == "title").Get<string>();
            var author = input.Children.First(x => x.Name == "author").Get<string>();
            var created = input.Children.First(x => x.Name == "created").Get<DateTime>();

            // Unrolling any plugins found in [content].
            content = UnrollPlugins(signaler, content);

            // Transforming content and template.
            var result = template.Replace("![[content]]!", content);
            result = result.Replace("![[title]]!", title);
            result = result.Replace("![[author]]!", author);
            result = result.Replace("![[created]]!", created.ToString("dddd d. MMM HH:mm", CultureInfo.InvariantCulture));

            // Returning results to caller.
            input.Value = result;
        }

        #region [ -- Private helper methods -- ]

        /*
         * Unrolls plugins referenced in specified content.
         */
        string UnrollPlugins(ISignaler signaler, string content)
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
                         */
                        result.Append(Markdown.ToHtml(buffer.ToString()));
                        buffer.Clear();
                        line = reader.ReadLine(); // Discarding opening "![[" parts.
                        while(line != "]]!")
                        {
                            buffer.Append(line).Append("\r\n");
                            line = reader.ReadLine();
                        }
                        var lambda = new Parser(buffer.ToString()).Lambda();
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
                result.Append(Markdown.ToHtml(buffer.ToString()));
            }
            return result.ToString();
        }

        #endregion
    }
}