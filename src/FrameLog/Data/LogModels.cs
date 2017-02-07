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

    public class WithInit : WithIdAndTimeStamp
    {
        internal WithInit()
        {
            Id = Guid.NewGuid();
            TimeStamp = DateTime.UtcNow;
        }

        [Key]
        public virtual Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
    }

    public class Log : WithInit
    {        
        public Guid? UserId { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Stack { get; set;  }
        public string Location { get; set; }
    }
}
