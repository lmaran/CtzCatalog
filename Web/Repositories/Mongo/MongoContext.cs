using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Repositories.Mongo
{
    public partial class MongoContext
    {
        // Mongo Conventions are registered only once per AppDomain
        static MongoContext()
        {
            RegisterConventions();
        }

        public MongoContext(string connectionString)
        {
            Url = new MongoUrl(connectionString);
            Client = new MongoClient(Url);
            Server = Client.GetServer();
        }


        public MongoClient Client { get; private set; }
        private MongoUrl Url { get; set; }
        public MongoServer Server { get; private set; }


        public MongoDatabase Database
        {
            get { return Server.GetDatabase(Url.DatabaseName); }
        }


        public static MongoContext AppInstance { get; private set; }


        public static void RegisterAppContext(MongoContext context)
        {
            AppInstance = context;
        }


    }
}