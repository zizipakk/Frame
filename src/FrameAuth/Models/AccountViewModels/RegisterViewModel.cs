using System.ComponentModel.DataAnnotations;

namespace FrameAuth.Models.AccountViewModels
{
    public class RegisterViewModel
    {
        [Required]
       // [EmailAddress(ErrorMessageResourceType = typeof(RegisterViewModel), ErrorMessageResourceName = nameof(Email) + "_EmailAddress")]
        [Display(Name = nameof(Email))]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceType = typeof(RegisterViewModel), ErrorMessageResourceName = nameof(Password) + "_StringLength")]
        [DataType(DataType.Password)]
        [Display(Name = nameof(Password))] // .net core lookup for resource automatic, if not validation annotation
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = nameof(ConfirmPassword))]
        [Compare("Password", ErrorMessageResourceType = typeof(RegisterViewModel), ErrorMessageResourceName = nameof(ConfirmPassword) + "_Compare")]
        public string ConfirmPassword { get; set; }

        [Display(Name = nameof(IsAdmin))]
        public bool IsAdmin { get; set; }
    }
}
