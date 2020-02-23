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
    /// [magic.publishing.cache] slot for returning an item from cache,
    /// and if it doesn't exist,evaluates the specified lambda, sets the cache
    /// and then returns the item.
    /// </summary>
    [Slot(Name = "magic.publishing.cache")]
    public class Cache : ISlot
    {
        readonly IMemoryCache _memoryCache;

        public Cache(IMemoryCache memoryCache)
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
            // Checking cache first.
            var key = input.GetEx<string>();
            if (_memoryCache.TryGetValue(key, out Node value))
            {
                input.AddRange(value.Children.Select(x => x.Clone()));
                input.Value = value.Value;
            }
            else
            {
                var evalResult = new Node();
                signaler.Scope("slots.result", evalResult, () =>
                {
                    signaler.Signal("eval", input.Children.First(x => x.Name == ".lambda"));
                });
                _memoryCache.Set(
                    key,
                    evalResult,
                    DateTimeOffset.Now.AddSeconds(input.Children.FirstOrDefault(x => x.Name == "seconds")?.GetEx<int>() ?? 5));
                input.Clear();
                input.AddRange(evalResult.Children.Select(x => x.Clone()));
                input.Value = evalResult.Value;
            }
        }
    }
}
