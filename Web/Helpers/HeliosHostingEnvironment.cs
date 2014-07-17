using System;
using System.IO;

namespace Visma.Services.CloudBI.Web.Helpers
{
    public static class HeliosHostingEnvironment
    {
        /// <summary>
        /// Get a virtual path, like "~/App/views"
        /// and return a physical path, like "C:\inetpub\wwwroot\App\views"
        /// </summary>
        public static string MapPath(string virtualPath)
        {
            var path = virtualPath.TrimStart('~', '/').Replace('/', '\\');
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
        }
    }
}