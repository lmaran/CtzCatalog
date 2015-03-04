using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Web.Helpers;

namespace Web.Controllers
{
    public class AdminController: ApiController
    {
        //[Route("admin")]
        public HtmlActionResult Get()
        {
            return new HtmlActionResult(Request, "admin.html");
        }
    }
}