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
    /// [magic.publishing.cache.get] slot for returning an item from cache. Returns null if item doesn't exist.
    /// </summary>
    [Slot(Name = "magic.publishing.settings.get")]
    [Slot(Name = "wait.magic.publishing.settings.get")]
    public class SettingGet : ISlot, ISlotAsync
    {
        readonly IMemoryCache _memoryCache;
        readonly static SemaphoreSlim _semaphore = new SemaphoreSlim(1);
        const string _cacheKey = "magic.publishing.settings";

        public SettingGet(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        /// <summary>
        /// Implementation of signal.
        /// </summary>
        /// <param name="signaler">Signaler used to signal.</param>
        /// <param name="input">Parameters passed from signaler.</param>
        public void Signal(ISignaler signaler, Node input)
        {
            // Retrieving name of setting to retrieve.
            var key = input.GetEx<string>() ?? "";

            // Trying to fetch setting from cache.
            input.Value = TryGetCache(key, out bool hasCache);

            // Checking that settings exists in cache, and if not, populating it.
            if (!hasCache)
            {
                // Avoiding having multiple threads trying to populate cache.
                _semaphore.Wait();
                try
                {
                    // Double checking to avoid race conditions.
                    input.Value = TryGetCache(key, out hasCache);
                    if (hasCache)
                        return; // Some other thread filled up our cache for us.

                    // Settings still not in cache, loading settings and putting it into cache.
                    var node = new Node("mysql.select", "select * from settings");
                    signaler.Signal("mysql.select", node);
                    _memoryCache.Set(
                        _cacheKey,
                        node,
                        DateTimeOffset.Now.AddMinutes(5));
                    input.Value = TryGetCache(key, out hasCache);
                }
                finally
                {
                    _semaphore.Release();
                }
            }
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

            // Trying to fetch setting from cache.
            input.Value = TryGetCache(key, out bool hasCache);

            // Checking that settings exists in cache, and if not, populating it.
            if (!hasCache)
            {
                // Avoiding having multiple threads trying to populate cache.
                await _semaphore.WaitAsync();
                try
                {
                    // Double checking to avoid race conditions.
                    input.Value = TryGetCache(key, out hasCache);
                    if (hasCache)
                        return; // Some other thread filled up our cache for us.

                    // Settings still not in cache, loading settings and putting it into cache.
                    var node = new Node("wait.mysql.select", "select * from settings");
                    await signaler.SignalAsync("wait.mysql.select", node);
                    _memoryCache.Set(
                        _cacheKey,
                        node,
                        DateTimeOffset.Now.AddMinutes(5));
                    input.Value = TryGetCache(key, out hasCache);
                }
                finally
                {
                    _semaphore.Release();
                }
            }
        }

        #region [ -- Private helper methods -- ]

        object TryGetCache(string key, out bool hasCache)
        {
            if (_memoryCache.TryGetValue(_cacheKey, out Node value))
            {
                // Cache hit for specified settings key.
                foreach (var idxChild in value.Children)
                {
                    if (idxChild.Children.Any(x => x.Name == "name" && x.Get<string>() == key))
                    {
                        hasCache = true;
                        return idxChild.Children.First(x => x.Name == "value").Get<object>();
                    }
                }
            }

            // Settings not found in cache.
            hasCache = false;
            return null;
        }

        #endregion
    }
}
