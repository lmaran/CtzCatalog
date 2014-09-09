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
        public void ConfigureJsonNet()
        {
            // need it to ignore null properties at serialization
            // e.g. the client send a JSON with no property, Web Api bind to a null property an AutoMapper need to ignore it again
            // an alternative could to put this setting at mapping level, individually
            // e.g. ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Options, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })));
            // so, when data come from client, it's not enough to set this option at WebApi level because AutoMapper can overwrite it
            // similarly, we have to add this setting at WebApi level to suppress null properties sent as JSON to the client
            // http://stackoverflow.com/a/18832929/2726725
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver() //Camel Case for JSON data
            };
        }
    }
}