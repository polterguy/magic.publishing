/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.Linq;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

namespace backend.slots
{
    /// <summary>
    /// [magic.publishing.cache.is-expired] slot for checking if cached item is
    /// expired, and should re-render the document back to the client.
    /// </summary>
    [Slot(Name = "magic.publishing.cache.is-expired")]
    public class CacheIsExpired : ISlot
    {
        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            var seconds = input.Children
                .First(x => x.Name == "seconds").GetEx<int>();
            var lastRendered = input.Children
                .First(x => x.Name == "If-Modified-Since").GetEx<DateTime>()
                .ToUniversalTime();
            input.Value = lastRendered.AddSeconds(seconds) < DateTime.Now.ToUniversalTime();
        }
    }
}
