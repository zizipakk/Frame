using System;
using System.ComponentModel.DataAnnotations;

namespace FrameHelper
{
    public class EntityHelpers
    {
        public interface WithIdAndTimeStamp
        {
            Guid Id { get; set; }
            DateTime TimeStamp { get; set; }
        }

        public class WithInit : WithIdAndTimeStamp
        {
            public WithInit()
            {
                Id = Guid.NewGuid();
                TimeStamp = DateTime.UtcNow;
            }

            [Key]
            public virtual Guid Id { get; set; }
            public DateTime TimeStamp { get; set; }
        }
    }
}
