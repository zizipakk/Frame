using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using FrameAudit;
using ElasticsearchCRUD.ContextAddDeleteUpdate.CoreTypeAttributes;
using System.ComponentModel.DataAnnotations;
using static FrameHelper.EntityHelpers;
using System.Collections.Generic;
using FrameSearch.ElasticSearchProvider;

namespace FrameAuth.Data
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser, IEntityWithId<string>
    {
        public bool IsAdmin { get; set; }
    }

    public interface IApplicationUserLog : IWithIdAndTimeStamp
    {
        int AccessFailedCount { get; set; }
        bool LockoutEnabled { get; set; }
        DateTimeOffset? LockoutEnd { get; set; }
        bool TwoFactorEnabled { get; set; }
        bool PhoneNumberConfirmed { get; set; }
        string PhoneNumber { get; set; }
        string ConcurrencyStamp { get; set; }
        string SecurityStamp { get; set; }
        string PasswordHash { get; set; }
        bool EmailConfirmed { get; set; }
        string NormalizedEmail { get; set; }
        string Email { get; set; }
        string NormalizedUserName { get; set; }
        string UserName { get; set; }
    }

    public class ApplicationUserLog : LogModelExtension, IWithIdAndTimeStamp, IApplicationUserLog
    {
        public Guid Id { get; set; }
        public int AccessFailedCount { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string SecurityStamp { get; set; }
        public string PasswordHash { get; set; }
        public bool EmailConfirmed { get; set; }
        public string NormalizedEmail { get; set; }
        public string Email { get; set; }
        public string NormalizedUserName { get; set; }
        public string UserName { get; set; }
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
