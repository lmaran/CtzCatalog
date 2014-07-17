using Owin;
using Microsoft.Owin;

namespace Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
             app.UseStaticFiles(); //TODO: we need it for Helios

            // Configure database context
            // ConfigureDatabase(app);

            // Authentication configuration
            // ConfigureAuth(app);

            // SignalR configuration
            // ConfigureWebSockets(app);

            // Web.API configuration
            ConfigureWebApi(app);
        }
    }
}