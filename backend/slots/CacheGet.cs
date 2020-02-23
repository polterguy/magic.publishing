/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using Microsoft.Extensions.Caching.Memory;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

namespace backend.slots
{
    /// <summary>
    /// [cache.get] slot for returning an item from cache. Returns null if item doesn't exist.
    /// </summary>
    [Slot(Name = "cache.get")]
    public class CacheGet : ISlot
    {
        IMemoryCache _memoryCache;

        public CacheGet(IMemoryCache memoryCache)
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
            var key = input.GetEx<string>() ?? "";
            if (_memoryCache.TryGetValue(key, out object value))
                input.Value = value;
            else
                input.Value = null;
        }
    }
}
