using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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
    }
}
