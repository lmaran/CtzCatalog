using Owin;
using Microsoft.Owin;

namespace Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // app.UseStaticFiles(); //TODO: we need it for Helios

            // Configure database context
            ConfigureDatabase();

            // Authentication configuration
            // ConfigureAuth(app);

            // SignalR configuration
            // ConfigureWebSockets(app);

            // JSON.Net configuration (used by AutoMapper)
            ConfigureJsonNet();

            // Web.API configuration
            ConfigureWebApi(app);
        }
    }
}