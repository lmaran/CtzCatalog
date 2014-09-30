using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Table;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.App_Start;

namespace Web.Repositories.Azure
{
    public partial class AzureStorageContext
    {

        //private static readonly string ImagContainerName = "images";
        private const string ImagContainerName = "images";

        //// Conventions are registered only once per AppDomain
        //static AzureStorageContext()
        //{
        //    //RegisterConventions();
        //}

        public AzureStorageContext(string connectionString)
        {
            StorageAccount = CloudStorageAccount.Parse(connectionString);
            
            // Blob client
            BlobClient = StorageAccount.CreateCloudBlobClient();
            BlobClient.DefaultRequestOptions.RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(5), 3); //optional

            // Table client
            TableClient = StorageAccount.CreateCloudTableClient();
        }

        public CloudStorageAccount StorageAccount { get; private set; }

        // Blob:
        public CloudBlobClient BlobClient { get; private set; }

        // I've choose to pass-through the blobContainer object, rather than store it (by constructor)
        public CloudBlobContainer BlobImgContainer 
        {
            get { return BlobClient.GetContainerReference(ImagContainerName); }
        }

        // Table:
        public CloudTableClient TableClient { get; private set; }

        public CloudTable TableProducts
        {
            get { return TableClient.GetTableReference("products"); }
        }

        //public MongoDatabase Database
        //{
        //    get { return Server.GetDatabase(Url.DatabaseName); }
        //}

        //public MongoDatabase Database
        //{
        //    get { return Server.GetDatabase(Url.DatabaseName); }
        //}


        public static AzureStorageContext Instance { get; private set; }


        public static void RegisterContext(AzureStorageContext context)
        {
            Instance = context;
        }


    }
}