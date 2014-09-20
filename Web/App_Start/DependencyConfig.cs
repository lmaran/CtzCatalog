using Microsoft.Practices.Unity;
using Microsoft.WindowsAzure.Storage;
using SnowMaker;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using System.Web.Http.Dependencies;
using Web.Repositories;

namespace Web.App_Start
{
    public static class DependencyConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var container = new UnityContainer();

            container.RegisterType<IProductRepository, ProductRepository>();
            container.RegisterType<IPickOrderRepository, PickOrderRepository>();
            container.RegisterType<ICustomerRepository, CustomerRepository>();
            container.RegisterType<IOptionSetRepository, OptionSetRepository>();
            container.RegisterType<IAttributeRepository, AttributeRepository>();
            container.RegisterType<IAttributeSetRepository, AttributeSetRepository>();

            //var connString = ConfigurationManager.ConnectionStrings["CortizoAzureStorage"].ConnectionString;
            //var storageAccount = CloudStorageAccount.Parse(connString);

            //container.RegisterType<IUniqueIdGenerator, UniqueIdGenerator>(
            //    new ContainerControlledLifetimeManager(),
            //    new InjectionConstructor(
            //        new BlobOptimisticDataStore(storageAccount, "ctz-idgenerator")
            //    ),
            //    new InjectionProperty("BatchSize", 3));

            config.DependencyResolver = new UnityResolver(container);
        }

        // http://www.asp.net/web-api/overview/extensibility/using-the-web-api-dependency-resolver
        public class UnityResolver : IDependencyResolver
        {
            protected IUnityContainer container;

            public UnityResolver(IUnityContainer container)
            {
                if (container == null)
                {
                    throw new ArgumentNullException("container");
                }
                this.container = container;
            }

            public object GetService(Type serviceType)
            {
                try
                {
                    return container.Resolve(serviceType);
                }
                catch (ResolutionFailedException)
                {
                    return null;
                }
            }

            public IEnumerable<object> GetServices(Type serviceType)
            {
                try
                {
                    return container.ResolveAll(serviceType);
                }
                catch (ResolutionFailedException)
                {
                    return new List<object>();
                }
            }

            public IDependencyScope BeginScope()
            {
                var child = container.CreateChildContainer();
                return new UnityResolver(child);
            }

            public void Dispose()
            {
                container.Dispose();
            }
        }

    }
}