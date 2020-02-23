/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

namespace backend.slots
{
    /// <summary>
    /// [cache.set] slot for saving an item to the memory cache.
    /// </summary>
    [Slot(Name = "cache.set")]
    public class CacheSet : ISlot
    {
        IMemoryCache _memoryCache;

        public CacheSet(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            if (input.Children.Count() > 1)
                throw new ApplicationException("[cache.set] must have maximum one child");

            var key = input.GetEx<string>() ?? "";

            if (input.Children.Any())
            {
                signaler.Signal("eval", input);
                _memoryCache.Set(
                    key,
                    input.Children.First().GetEx<object>(),
                    DateTimeOffset.Now.AddMinutes(5));
            }
            else
            {
                _memoryCache.Remove(key);
            }
        }
    }
}
