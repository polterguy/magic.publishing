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
    /// [wait.magic.publishing.cache.get] slot for returning an item from cache. Returns null if item doesn't exist.
    /// </summary>
    [Slot(Name = "wait.magic.publishing.settings.get")]
    public class SettingGet : ISlotAsync
    {
        readonly IMemoryCache _memoryCache;
        readonly static SemaphoreSlim _semaphore = new SemaphoreSlim(1);
        internal const string _cacheKey = "magic.publishing.settings";

        public SettingGet(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        /// <summary>
        /// Handles the signal for the class.
        /// </summary>
        /// <param name="signaler">Signaler used to signal the slot.</param>
        /// <param name="input">Root node for invocation.</param>
        /// <returns>An awaitable task.</returns>
        public async Task SignalAsync(ISignaler signaler, Node input)
        {
            // Retrieving name of setting to retrieve.
            var key = input.GetEx<string>() ?? "";

            // Checking that settings exists in cache, and if not, populating it.
            if (TryGetCache(key, out string cachedValue))
            {
                input.Value = cachedValue;
                return;
            }

            // Avoiding having multiple threads trying to populate cache.
            await _semaphore.WaitAsync();
            try
            {
                // Double checking to avoid race conditions.
                if (TryGetCache(key, out cachedValue))
                {
                    // Some other thread filled our cache first.
                    input.Value = cachedValue;
                    return;
                }

                // Settings still not in cache, loading settings and putting it into cache.
                var node = new Node("wait.mysql.select", "select * from settings");
                await signaler.SignalAsync("wait.mysql.select", node);
                _memoryCache.Set(
                    _cacheKey,
                    node,
                    DateTimeOffset.Now.AddMinutes(5));
                TryGetCache(key, out cachedValue);
                input.Value = cachedValue;
            }
            finally
            {
                _semaphore.Release();
            }
        }

        #region [ -- Private helper methods -- ]

        bool TryGetCache(string key, out string result)
        {
            if (_memoryCache.TryGetValue(_cacheKey, out Node value))
            {
                // Cache hit for specified settings key.
                foreach (var idxChild in value.Children)
                {
                    if (idxChild.Children.Any(x => x.Name == "name" && x.Get<string>() == key))
                    {
                        result = idxChild.Children.First(x => x.Name == "value").Get<string>();
                        return true;
                    }
                }

                // We found cache, but we didn't find setting.
                result = null;
                return true;
            }

            // Settings not found in cache.
            result = null;
            return false;
        }

        #endregion
    }
}
