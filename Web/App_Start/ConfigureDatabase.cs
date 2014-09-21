using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Web.Repositories.Mongo;

namespace Web
{
    public partial class Startup
    {
        public static void ConfigureDatabase()
        {
            var appContext = new MongoContext(ConfigurationManager.AppSettings.Get("Cortizo_Local_URI"));
            //var appContext = new MongoContext(ConfigurationManager.AppSettings.Get("Cortizo_Azure_URI"));
            MongoContext.RegisterAppContext(appContext);
        }
    }
}