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

            // suppress properties with null value - http://stackoverflow.com/a/14486694/2726725
            // see more in ConfigureJsonNet.cs file
            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings
            {
                //// http://james.newtonking.com/archive/2009/10/23/efficient-json-with-json-net-reducing-serialized-json-size
                //// Use JsonIgnoreAttribute, DefaultValueAttribute and configure NullValueHandling, DefaultValueHandling
                //DefaultValueHandling = DefaultValueHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver() //Camel Case for JSON data
            };


            // Enabling Attribute Routing
            config.MapHttpAttributeRoutes();

            // Convention-based routing
            config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}", new { id = RouteParameter.Optional });
            config.Routes.MapHttpRoute("Admin", "admin/{*anything}", new { controller = "Admin" });
            config.Routes.MapHttpRoute("Home", "{*anything}", new { controller = "Home" });

            DependencyConfig.Register(config);

            app.UseWebApi(config);
        }
    }
}