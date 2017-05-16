using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace FrameHelper
{
    public class ControllerHelpers : ControllerBase
    {
        public async Task<IActionResult> ExceptionResponse(Exception e)
        {
            // TODO 500-at elnyomja a kestrel, szóval ezt nem engedi át
            var error = e;
            while (error.InnerException != null)
                error = error.InnerException;
            return await Task.Run(() => BadRequest(new { Error = error.Message, ErrorDescription = e.StackTrace }));
        }

        public async Task<IActionResult> ModelErrorResponse()
        {
            var errorList = ModelState.Values.SelectMany(v => v.Errors.Select(error => new { Error = error.ErrorMessage, ErrorDescription = error.Exception?.StackTrace }));
            var errorRaw = string.Empty;
            var descriptionRaw = string.Empty;
            errorList.ToList().ForEach(error =>
            {
                errorRaw = string.Join(" | ", error.Error);
                descriptionRaw = string.Join(" | ", error.ErrorDescription);
            });
            return await Task.Run(() => BadRequest(new { Error = errorRaw, ErrorDescription = descriptionRaw }));
        }
    }
}
