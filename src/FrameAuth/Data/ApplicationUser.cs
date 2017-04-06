using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using FrameAudit;
using System.ComponentModel.DataAnnotations;

namespace FrameAuth.Data
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public bool IsAdmin { get; set; }
    }

    public class ApplicationUserLog : ApplicationUser, ILogModelExtension
    {
        public ApplicationUserLog()
        {
            LogId = Guid.NewGuid();
            TimeStamp = DateTime.UtcNow;
        }

        public Guid LogId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string ExecutiveId { get; set; }
    }
}
