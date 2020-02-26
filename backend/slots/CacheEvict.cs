/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

namespace backend.slots
{
    /// <summary>
    /// [magic.publishing.cache.evict] slot for evicting an item out of the cache.
    /// </summary>
    [Slot(Name = "magic.publishing.cache.evict")]
    public class CacheEvict : ISlot
    {
        readonly IMemoryCache _memoryCache;

        public CacheEvict(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        /// <summary>
        /// Handles the signal for the class.
        /// </summary>
        /// <param name="signaler">Signaler used to signal the slot.</param>
        /// <param name="input">Root node for invocation.</param>
        /// <returns>An awaitable task.</returns>
        public void Signal(ISignaler signaler, Node input)
        {
            // Notice, default implementation *is* thread safe!
            _memoryCache.Remove(input.GetEx<string>());
        }
    }
}
