using System;
using System.ComponentModel.DataAnnotations;

namespace FrameHelper
{
    public class EntityHelpers
    {
        public interface IWithTimeStamp
        {
            DateTime TimeStamp { get; set; }
        }

        public interface IWithIdAndTimeStamp : IWithTimeStamp
        {
            Guid Id { get; set; }
        }

        public class WithInit : IWithIdAndTimeStamp
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
