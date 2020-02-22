/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.Linq;
using System.Globalization;
using Markdig;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

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
            var created = input.Children.First(x => x.Name == "created").Get<DateTime>();
            var title = input.Children.First(x => x.Name == "title").Get<string>();
            var author = input.Children.First(x => x.Name == "author").Get<string>();
            var content = input.Children.First(x => x.Name == "content").Get<string>();

            // Transforming content and template.
            var result = template.Replace("![[content]]!", Markdown.ToHtml(content));
            result = result.Replace("![[title]]!", title);
            result = result.Replace("![[author]]!", author);
            result = result.Replace("![[created]]!", created.ToString("dddd d. MMM HH:mm", CultureInfo.InvariantCulture));

            // Returning results to caller.
            input.Value = result;
        }
    }
}