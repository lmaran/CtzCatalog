using Web.Helpers;
using Web.Models;
using AutoMapper;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Linq.Expressions;
using SnowMaker;
using Newtonsoft.Json.Linq;
using System.Dynamic;
using Newtonsoft.Json.Serialization;
using System.Data;
using MongoDB.Driver;

namespace Web.Repositories
{
    public class OptionSetRepository : TableStorage<OptionSetEntry>, IOptionSetRepository
    {
        const string entityPluralName = "OptionSets";
        private readonly IUniqueIdGenerator _generator;

        public OptionSetRepository(IUniqueIdGenerator generator)
            : base(tableName: entityPluralName)
        {
            this._generator = generator;
        }


        public IEnumerable<OptionSet> GetAll(string lang)
        {
            var connectionString = "mongodb://localhost";
            var client = new MongoClient(connectionString);
            var server = client.GetServer();
            var database = server.GetDatabase("Cortizo");

            var collection = database.GetCollection<OptionSet>("OptionSets");
            return collection.FindAll();
        }

    }



    public interface IOptionSetRepository
    {
        IEnumerable<OptionSet> GetAll(string lang);

    }


}