using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FrameLog.Data
{
    interface WithIdAndTimeStamp
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
    }

    public class WithIdInit
    {
        internal WithIdInit()
        {
            Id = Guid.NewGuid();
        }

        [Key]
        public virtual Guid Id { get; set; }
    }

    public class Log : WithIdInit, WithIdAndTimeStamp
    {
        public DateTime TimeStamp { get; set; }
        public Guid? UserId { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Stack { get; set;  }
        public string Location { get; set; }
    }
}
