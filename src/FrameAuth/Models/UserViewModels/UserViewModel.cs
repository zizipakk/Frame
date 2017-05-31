using System;

namespace FrameAuth.Models.UserViewModels
{
    public enum LanguageIso
    {
        en = 0,
        hu,
        de
    }

    public interface IUserViewModel
    {
        int AccessFailedCount { get; set; }
        string Email { get; set; }
        bool EmailConfirmed { get; set; }
        Guid Id { get; set; }
        bool LockoutEnabled { get; set; }
        DateTimeOffset? LockoutEnd { get; set; }
        string NormalizedEmail { get; set; }
        string NormalizedUserName { get; set; }
        string PhoneNumber { get; set; }
        bool PhoneNumberConfirmed { get; set; }
        bool TwoFactorEnabled { get; set; }
        string UserName { get; set; }
        bool isAdmin { get; set; }
        LanguageIso Language { get; set; }
    }

    public class UserViewModel: IUserViewModel
    {
        public int AccessFailedCount { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public Guid Id { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public string NormalizedEmail { get; set; }
        public string NormalizedUserName { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string UserName { get; set; }
        public bool isAdmin { get; set; }
        public LanguageIso Language { get; set; }
    }
}
