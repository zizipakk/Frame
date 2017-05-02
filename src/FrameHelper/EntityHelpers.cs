using System;
using System.ComponentModel.DataAnnotations;

namespace FrameHelper
{
    public class EntityHelpers
    {
        public interface IWithIdAndTimeStamp
        {
            Guid Id { get; set; }
            DateTime TimeStamp { get; set; }
        }

        public class WithInit : IWithIdAndTimeStamp
        {
            public WithInit()
            {
                Id = Guid.NewGuid();
                TimeStamp = DateTime.UtcNow;
            }

            public virtual Guid Id { get; set; }
            public DateTime TimeStamp { get; set; }
        }
    }
}
