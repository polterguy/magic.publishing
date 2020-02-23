/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using System.Collections.Generic;
using magic.node;
using magic.node.extensions;
using magic.signals.contracts;

namespace backend.slots
{
    /// <summary>
    /// [magic.publishing.thread.lock] slot for synchronizing access to some shared resource.
    /// </summary>
    [Slot(Name = "magic.publishing.thread.lock")]
    public class ThreadLock : ISlot
    {
        readonly static object _addLocker = new object();
        readonly static Dictionary<string, object> _lockers = new Dictionary<string, object>();

        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            var key = input.GetEx<string>();
            if (_lockers.TryGetValue(key, out object locker))
            {
                WaitForIt(signaler, input, locker);
            }
            else
            {
                /*
                 * Since the dictionary of lockers itself is a shared resource,
                 * we need to synchronize access to that too as we insert new items.
                 */
                 lock (_addLocker)
                 {
                     // Double checking ...
                    if (_lockers.TryGetValue(key, out object locker2))
                    {
                        WaitForIt(signaler, input, locker2);
                    }
                    else
                    {
                        var locker3 = new object();
                        _lockers[key] = locker3;
                        WaitForIt(signaler, input, locker3);
                    }
                 }
            }
        }

        #region [ -- Private helper methods -- ]

        void WaitForIt(ISignaler signaler, Node input, object locker)
        {
            lock (locker)
            {
                signaler.Signal("eval", input);
            }
        }

        #endregion
    }
}
