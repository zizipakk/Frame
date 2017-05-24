using System.ComponentModel.DataAnnotations;

namespace FrameAuth.Models.AccountViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = nameof(Email))]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = nameof(Password))]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = nameof(ConfirmPassword))]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Display(Name = nameof(IsAdmin))]
        public bool IsAdmin { get; set; }
    }
}
