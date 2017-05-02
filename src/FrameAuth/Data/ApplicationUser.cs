using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using FrameAudit;
using ElasticsearchCRUD.ContextAddDeleteUpdate.CoreTypeAttributes;
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

        [Key]
        public Guid LogId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string ExecutiveId { get; set; }
    }

    public class ApplicationUserSearch : ApplicationUser
    {
        [ElasticsearchString(CopyToList = new[] { "autocomplete", "searchfield" })]
        public override string PhoneNumber { get; set; }

        [ElasticsearchString(CopyToList = new[] { "autocomplete", "searchfield" })]
        public override string NormalizedEmail { get; set; }

        [ElasticsearchString(CopyToList = new[] { "autocomplete", "searchfield" })]
        public override string Email { get; set; }

        [ElasticsearchString(CopyToList = new[] { "autocomplete", "searchfield" })]
        public override string NormalizedUserName { get; set; }

        [ElasticsearchString(CopyToList = new[] { "autocomplete", "searchfield" })]
        public override string UserName { get; set; }
    }
}
