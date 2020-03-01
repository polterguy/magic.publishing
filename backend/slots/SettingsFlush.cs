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
    /// [magic.publishing.cache.flush] slot for entirely removing settings from cache,
    /// which forces re-fetching settings next time some thread needs to access the settings
    /// for the application.
    /// </summary>
    [Slot(Name = "magic.publishing.settings.flush")]
    public class SettingsFlush : ISlot
    {
        readonly IMemoryCache _memoryCache;

        public SettingsFlush(IMemoryCache memoryCache)
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
            _memoryCache.Remove(SettingGet._cacheKey);
        }
    }
}
