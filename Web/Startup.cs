using Owin;
using Microsoft.Owin;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //app.Use(typeof(LogMiddleware));

            // app.UseStaticFiles(); //TODO: we need it for Helios

            // Configure database context
            ConfigureDatabase();

            // Authentication configuration
            // ConfigureAuth(app);

            // SignalR configuration
            // ConfigureWebSockets(app);

            // JSON.Net configuration (used by AutoMapper)
            //ConfigureJsonNet();

            // Web.API configuration
            ConfigureWebApi(app);
        }
    }

    public class LogMiddleware : OwinMiddleware
    {
        public LogMiddleware(OwinMiddleware next)
            : base(next)
        {

        }

        public async override Task Invoke(IOwinContext context)
        {
            Debug.WriteLine("Request begins: {0} {1}", context.Request.Method, context.Request.Uri);
            await Next.Invoke(context);
            Debug.WriteLine("Request ends : {0} {1}", context.Request.Method, context.Request.Uri);
        }
    }
}