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
    /// [magic.publishing.cache] slot for returning an item from cache,
    /// and if it doesn't exist,evaluates the specified lambda, sets the cache
    /// and then returns the item.
    /// </summary>
    [Slot(Name = "magic.publishing.cache")]
    [Slot(Name = "wait.magic.publishing.cache")]
    public class Cache : ISlot, ISlotAsync
    {
        /*
         * Limiting number of threads that can simultaneously execute its lambda
         * object inside of cache retrieval, to prevent thread pool starvation.
         */
        readonly static SemaphoreSlim _semaphore = new SemaphoreSlim(4);
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
            if (!GetFromCache(key, input))
            {
                /*
                 * Making sure no more than max number of threads can
                 * execute code simultaneously. This is to avoid hundreds of
                 * simultaneous threads trying to access the database, and/or the same
                 * document at the same time, before cache has been validated,
                 * resulting in exhausting the server.
                 */
                _semaphore.Wait();
                try
                {
                    // Double checking, in case another thread was able to retrieve content first.
                    if (!GetFromCache(key, input))
                    {
                        // Evaluating [.lambda] to retrieve item to cache and return to caller.
                        var evalResult = new Node();
                        signaler.Scope(
                            "slots.result",
                            evalResult,
                            () => signaler.Signal("eval", input.Children.First(x => x.Name == ".lambda")));

                        // Clearing lambda and value.
                        input.Clear();
                        input.Value = null;

                        /*
                        * Checking to see if anything was returned at all,
                        * and if not, we don't store anything into our cache.
                        */
                        if (evalResult.Value != null || evalResult.Children.Any())
                        {
                            _memoryCache.Set(
                                key,
                                evalResult,
                                DateTimeOffset.Now.AddSeconds(
                                    input.Children.FirstOrDefault(x => x.Name == "seconds")?.GetEx<int>() ?? 5));
                            input.AddRange(evalResult.Children.Select(x => x.Clone()));
                            input.Value = evalResult.Value;
                        }
                    }
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
            // Checking cache first.
            var key = input.GetEx<string>();
            if (!GetFromCache(key, input))
            {
                /*
                 * Making sure no more than max number of threads can
                 * execute code simultaneously. This is to avoid hundreds of
                 * simultaneous threads trying to access the database, and/or the same
                 * document at the same time, before cache has been validated,
                 * resulting in exhausting the server.
                 */
                await _semaphore.WaitAsync();
                try
                {
                    // Double checking, in case another thread was able to retrieve content first.
                    if (!GetFromCache(key, input))
                    {
                        // Evaluating [.lambda] to retrieve item to cache and return to caller.
                        var evalResult = new Node();
                        await signaler.ScopeAsync(
                            "slots.result",
                            evalResult,
                            async () => await signaler.SignalAsync("eval", input.Children.First(x => x.Name == ".lambda")));

                        /*
                        * Checking to see if anything was returned at all,
                        * and if not, we don't store anything into our cache.
                        */
                        if (evalResult.Value != null || evalResult.Children.Any())
                        {
                            /*
                             * Storing into cache, notice we default cache time to 60 seconds, unless
                             * explicitly overridden as [seconds].
                             * We also clone result before adding to cache, to prevent later changes to propagate
                             * to cache value.
                             */
                            var clone = evalResult.Clone();
                            _memoryCache.Set(
                                key,
                                clone,
                                DateTimeOffset.Now.AddSeconds(
                                    input.Children.FirstOrDefault(x => x.Name == "seconds")?.GetEx<int>() ?? 60));

                            // Clearing children and value, and adding value fetched from lambda.
                            input.Clear();
                            input.Value = null;
                            input.AddRange(evalResult.Children.Select(x => x.Clone()));
                            input.Value = evalResult.Value;
                        }
                    }
                }
                finally
                {
                    _semaphore.Release();
                }
            }
        }

        #region [ -- Private helper methods -- ]

        bool GetFromCache(string key, Node result)
        {
            if (_memoryCache.TryGetValue(key, out Node value))
            {
                // Cache hit.
                result.Value = value.Value;
                result.Clear();
                result.AddRange(value.Children.Select(x => x.Clone()));
                return true;
            }
            return false;
        }

        #endregion
    }
}
