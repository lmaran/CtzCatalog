using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using System.Web.Http;
using Microsoft.Owin.StaticFiles;
using Web.App_Start;

namespace Web
{
    public partial class Startup
    {
        public void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            //config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver(); //Camel Case for JSON data

            // suppress properties with null value - http://stackoverflow.com/a/14486694/2726725
            // see more in ConfigureJsonNet.cs file
            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings { 
                NullValueHandling = NullValueHandling.Ignore, 
                ContractResolver = new CamelCasePropertyNamesContractResolver() //Camel Case for JSON data
            };

            // Enabling Attribute Routing
            config.MapHttpAttributeRoutes();

            // Convention-based routing
            config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}", new { id = RouteParameter.Optional });
            config.Routes.MapHttpRoute("Home", "{*anything}", new { controller = "Home" });

            DependencyConfig.Register(config);

            app.UseWebApi(config);
        }
    }
}