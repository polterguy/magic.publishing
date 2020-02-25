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
    /// [magic.publishing.date.format] slot for formatting a DateTime to its HTTP equivalent.
    /// </summary>
    [Slot(Name = "magic.publishing.date.format")]
    public class FormatDate : ISlot
    {
        /// <summary>
        /// Implementation of signal
        /// </summary>
        /// <param name="signaler">Signaler used to signal</param>
        /// <param name="input">Parameters passed from signaler</param>
        public void Signal(ISignaler signaler, Node input)
        {
            input.Value = input.GetEx<DateTime>()
                .ToUniversalTime()
                .ToString(input.Children.FirstOrDefault()?.GetEx<string>() ?? "r");
            input.Clear();
        }
    }
}
