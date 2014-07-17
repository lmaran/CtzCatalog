using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Web.Helpers;

namespace Web.Controllers
{
    public class HomeController: ApiController
    {
        public HtmlActionResult Get()
        {
            return new HtmlActionResult(Request, "index.html");
        }
    }
}