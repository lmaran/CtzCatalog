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

namespace Web.Repositories
{
    public class OptionSetRepositoryAzure : TableStorage<OptionSetEntry>, IOptionSetRepository
    {
        const string entityPluralName = "OptionSets";
        private readonly IUniqueIdGenerator _generator;

        public OptionSetRepositoryAzure(IUniqueIdGenerator generator)
        //public OptionSetRepository()
            : base(tableName: entityPluralName)
        {
            this._generator = generator;
        }

        public void Add(OptionSet item)
        {
            // experiments with idGenerator:
            //var connString = ConfigurationManager.ConnectionStrings["CortizoAzureStorage"].ConnectionString;
            //var storageAccount = CloudStorageAccount.Parse(connString);

            //var _store = new BlobOptimisticDataStore(storageAccount, "testContainer");
            //var generator = new UniqueIdGenerator(_store) { BatchSize = 3 };

            //var generatedId = _generator.NextId("test");


            //var entity = new DynamicTableEntity();

            //entity.Properties["Name"] = new EntityProperty(item.Name);
            //entity.Properties["Description"] = new EntityProperty(item.Description);
            //entity.PartitionKey = "p";
            //entity.RowKey = Guid.NewGuid().ToString();
            
            // met.2
            Mapper.CreateMap<OptionSet, OptionSetEntry>().ForAllMembers(c => c.Condition(srs => !srs.IsSourceValueNull));
            Mapper.CreateMap<OptionSet, OptionSetEntry>()
                //.ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                //.ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.Name.GenerateSlug()))
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => _generator.NextId(entityPluralName)))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"))
                //.ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Options, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })));
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Options)));
            var entity = Mapper.Map<OptionSet, OptionSetEntry>(item);

            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }


        public void AddAsJson(JObject item)
        {
            // in cazul JObject WebAPI nu mai face nicio deserializare => datele ajunga cu litera mica (asa cum au fost trimise de client)
            // dar vrem ca in TableStorage sa fie memorate cu lit. mare (sa ramana compatibile cu stilul TypeSafe

            dynamic entity = new DynamicTableEntity("p", _generator.NextId(entityPluralName).ToString());


            entity.Properties["Name"] = new EntityProperty((string)item["name"]);
            entity.Properties["Description"] = new EntityProperty((string)item["description"]);
            entity.Properties["Options"] = new EntityProperty((string)JsonConvert.SerializeObject(item["options"]));

            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<OptionSet> GetAll(string lang)
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<OptionSetEntry, OptionSet>()
                .ForMember(dest => dest.OptionSetId, opt => opt.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<Option>>(src.Options ?? string.Empty)));

            var entitiesVM = Mapper.Map<List<OptionSetEntry>, List<OptionSet>>(entitiesTable.ToList()); //neaparat cu ToList()

            // met asta nu a functionat. La primul apel rezultatul oferit e ok dar la urmatoarele, param. "lang" "revine" la valoarea initiala
            //Mapper.CreateMap<OptionSetEntry, OptionSetViewModel>()
            //    .ForMember(dest => dest.OptionSetId, opt => opt.MapFrom(src => src.RowKey))
            //    .ForMember(dest => dest.TranslatedName, 
            //        opt => opt.ResolveUsing<CustomResolver>().ConstructedBy(() => new CustomResolver(lang))    );               
            //var entitiesVM = Mapper.Map<List<OptionSetEntry>, List<OptionSetViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()


            // ok, with translations
            //var entitiesVM = new List<OptionSetViewModel>();
            //foreach (var item in entitiesTable)
            //{

            //    var newName = item.Name;
            //    if (lang != null && !string.IsNullOrEmpty(item.TranslatedName))
            //    {
            //        string translatedName;
            //        var transDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(item.TranslatedName);
            //        if (transDictionary.TryGetValue(lang, out translatedName))
            //            newName = translatedName;
            //    }

            //    entitiesVM.Add(new OptionSetViewModel()
            //    {
            //        OptionSetId = item.RowKey,
            //        Name = newName,
            //        Description = item.Description
            //    });
            //}

            return entitiesVM;
        }

        public IEnumerable<JObject> GetAllAsJson(string lang)
        {
            // How to get Table schema with DynamicEntityTable? - http://code.msdn.microsoft.com/windowsazure/How-to-CRUD-table-storage-ebefd270

            // Define Azure table properties at the run time  (CSAzureDynamicTableEntity) - http://code.msdn.microsoft.com/windowsazure/Dynamic-TableServiceEntity-151d661f
            // http://pascallaurin42.blogspot.ro/2013/03/using-azure-table-storage-with-dynamic.html
            //var query = new TableQuery().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p"));
            var query = new TableQuery();
            var tableResults = Table.ExecuteQuery(query);

            var list = new List<JObject>();






            //DataTable propertiesTable = new DataTable("CSAzureGetTableSchemaWithDynamicEntity");

            //// A Dynamic Entity Table must have the properties in ITableEntity. 
            //DataColumn partitionKeyColumn = new DataColumn();
            //partitionKeyColumn.DataType = Type.GetType("System.String");
            //partitionKeyColumn.ColumnName = "Partition Key";
            //propertiesTable.Columns.Add(partitionKeyColumn);

            //DataColumn rowKeyColumn = new DataColumn();
            //rowKeyColumn.DataType = Type.GetType("System.String");
            //rowKeyColumn.ColumnName = "Row Key";
            //propertiesTable.Columns.Add(rowKeyColumn);

            // Dynamic Entity Table has a property called Properties which includes other table column as KeyValue pair. 
            foreach (var entity in tableResults)
            {

                dynamic item = new JObject();
                //item.PartitionKey = entity.PartitionKey;
                //item.RowKey = entity.RowKey;
                item["optionSetId"] = entity.RowKey;
                //entity.RowKey = Guid.NewGuid



                //entity.Properties["Name"] = new EntityProperty((string)item["name"]);
                //entity.Properties["Description"] = new EntityProperty((string)item["description"]);
                //entity.Properties["Options"] = new EntityProperty((string)JsonConvert.SerializeObject(item["options"]));


                if (entity.Properties != null)
                {
                    foreach (var kvp in entity.Properties)
                    {
                        var camelCaseKey = Char.ToLowerInvariant(kvp.Key[0]) + kvp.Key.Substring(1); //http://stackoverflow.com/a/3565041/2726725
                        switch (kvp.Value.PropertyType)
                        {
                            case EdmType.Binary:
                                item[camelCaseKey] = kvp.Value.BinaryValue;
                                break;
                            case EdmType.Boolean:
                                item[camelCaseKey] = kvp.Value.BooleanValue;
                                break;
                            case EdmType.DateTime:
                                item[camelCaseKey] = kvp.Value.DateTimeOffsetValue;
                                break;
                            case EdmType.Double:
                                item[camelCaseKey] = kvp.Value.DoubleValue;
                                break;
                            case EdmType.Guid:
                                item[camelCaseKey] = kvp.Value.GuidValue;
                                break;
                            case EdmType.Int32:
                                item[camelCaseKey] = kvp.Value.Int32Value;
                                break;
                            case EdmType.Int64:
                                item[camelCaseKey] = kvp.Value.Int64Value;
                                break;
                            case EdmType.String:
                                if (!string.IsNullOrEmpty(kvp.Value.StringValue))
                                    if (camelCaseKey == "options")
                                        item[camelCaseKey] = JArray.Parse(kvp.Value.StringValue);
                                    else
                                        item[camelCaseKey] = kvp.Value.StringValue;
                                break;
                            default:
                                break;
                        }

                    }
                }
                list.Add(item);

            }
            return list;

        }

        public OptionSet GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<OptionSetEntry, OptionSet>()
                .ForMember(dest => dest.OptionSetId, opt => opt.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<Option>>(src.Options ?? string.Empty)));

            return Mapper.Map<OptionSetEntry, OptionSet>(entry);
        }

        public JObject GetByIdAsJson(string itemId)
        {
            //var query = new TableQuery(); 
            //var tableResults = Table.ExecuteQuery(query); 

            //DataTable propertiesTable = new DataTable("CSAzureGetTableSchemaWithDynamicEntity"); 
 
            //// A Dynamic Entity Table must have the properties in ITableEntity. 
            //DataColumn partitionKeyColumn = new DataColumn(); 
            //partitionKeyColumn.DataType = Type.GetType("System.String"); 
            //partitionKeyColumn.ColumnName = "Partition Key"; 
            //propertiesTable.Columns.Add(partitionKeyColumn); 
 
            //DataColumn rowKeyColumn = new DataColumn(); 
            //rowKeyColumn.DataType = Type.GetType("System.String"); 
            //rowKeyColumn.ColumnName = "Row Key"; 
            //propertiesTable.Columns.Add(rowKeyColumn); 
 
            //// Dynamic Entity Table has a property called Properties which includes other table column as KeyValue pair. 
            //foreach (var entity in tableResults)
            //{
            //    DataRow row;
            //    row = propertiesTable.NewRow();
            //    row["Partition Key"] = entity.PartitionKey;
            //    row["Row Key"] = entity.RowKey;
            //    if (entity.Properties != null)
            //    {
            //        foreach (var kvp in entity.Properties)
            //        {
            //            if (!propertiesTable.Columns.Contains(kvp.Key))
            //            {
            //                DataColumn column = new DataColumn();
            //                column.ColumnName = kvp.Key;
            //                column.DataType = Type.GetType("System." + kvp.Value.PropertyType.ToString());
            //                propertiesTable.Columns.Add(column);
            //            }

            //            switch (kvp.Value.PropertyType)
            //            {
            //                case EdmType.Binary:
            //                    row[kvp.Key] = kvp.Value.BinaryValue;
            //                    break;
            //                case EdmType.Boolean:
            //                    row[kvp.Key] = kvp.Value.BooleanValue;
            //                    break;
            //                case EdmType.DateTime:
            //                    row[kvp.Key] = kvp.Value.DateTimeOffsetValue;
            //                    break;
            //                case EdmType.Double:
            //                    row[kvp.Key] = kvp.Value.DoubleValue;
            //                    break;
            //                case EdmType.Guid:
            //                    row[kvp.Key] = kvp.Value.GuidValue;
            //                    break;
            //                case EdmType.Int32:
            //                    row[kvp.Key] = kvp.Value.Int32Value;
            //                    break;
            //                case EdmType.Int64:
            //                    row[kvp.Key] = kvp.Value.Int64Value;
            //                    break;
            //                case EdmType.String:
            //                    row[kvp.Key] = kvp.Value.StringValue;
            //                    break;
            //                default:
            //                    break;
            //            }

            //        }
            //    }
            //    propertiesTable.Rows.Add(row);

            //}



            // How to get Table schema with DynamicEntityTable? - http://code.msdn.microsoft.com/windowsazure/How-to-CRUD-table-storage-ebefd270

            // Define Azure table properties at the run time  (CSAzureDynamicTableEntity) - http://code.msdn.microsoft.com/windowsazure/Dynamic-TableServiceEntity-151d661f
            // http://pascallaurin42.blogspot.ro/2013/03/using-azure-table-storage-with-dynamic.html
            var query = new TableQuery();
            var tableResults = Table.ExecuteQuery(query);


            var operation = TableOperation.Retrieve("p", itemId);
            var result = Table.Execute(operation);
            dynamic entity = result.Result;


            dynamic item = new JObject();
            item["optionSetId"] = itemId;


            //// immediate window
            //entity.Properties["Name"].PropertyType
            //String
            //entity.Properties["Name"].PropertyAsObject
            //"aabbcc"
            //entity.Properties["Name"].StringValue
            //"aabbcc"


            item["name"] = entity.Properties["Name"].StringValue;
            item["description"] = entity.Properties["Description"].StringValue;

            JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings()
            {
                //DefaultValueHandling = DefaultValueHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var xxx = entity.Properties["Options"].StringValue;

            //var yyy = xxx.Replace(@"\""", @"""");

            //string json = JsonConvert.SerializeObject(yyy, jsonSerializerSettings);

            //json = json.Replace(@"\""", @"""");
            JArray options = JArray.Parse(xxx);

            item["options"] = options;
            
            return item;
        }

        public void Update(OptionSet item)
        {
            Mapper.CreateMap<OptionSet, OptionSetEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.OptionSetId))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Options)));

            var entity = Mapper.Map<OptionSet, OptionSetEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void UpdateAsJson(JObject item)
        {
            // in cazul JObject WebAPI nu mai face nicio deserializare => datele ajunga cu litera mica (asa cum au fost trimise de client)
            // dar vrem ca in TableStorage sa fie memorate cu lit. mare (sa ramana compatibile cu stilul TypeSafe

            dynamic entity = new DynamicTableEntity("p", (string)item["optionSetId"]);


            entity.Properties["Name"] = new EntityProperty((string)item["name"]);
            entity.Properties["Description"] = new EntityProperty((string)item["description"]);
            entity.Properties["Options"] = new EntityProperty((string)JsonConvert.SerializeObject(item["options"]));

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            //var item = new OptionSetEntry();
            //item.PartitionKey = "p";
            //item.RowKey = itemId;

            dynamic entity = new DynamicTableEntity("p", itemId);

            //this.Delete(entity);
            entity.ETag = "*";
            var operation = TableOperation.Delete(entity);
            Table.Execute(operation);
        }

    }


    public interface IOptionSetRepositoryAzure : ITableStorage<OptionSetEntry>
    {
        void Add(OptionSet item);
        IEnumerable<OptionSet> GetAll(string lang);
        OptionSet GetById(string itemId);
        void Update(OptionSet item);
        void Delete(string itemId);

        void AddAsJson(JObject item);
        IEnumerable<JObject> GetAllAsJson(string lang);
        JObject GetByIdAsJson(string itemId);
        void UpdateAsJson(JObject item);
    }


    //// met. asta nu a functionat ok decat la primul apel -> nu o mai folosesc
    //public class CustomResolver : ValueResolver<OptionSetEntry, string>
    //{
    //    public string _lang;
    //    public CustomResolver(string lang)
    //    {
    //        _lang = lang;
    //    }

    //    protected override string ResolveCore(OptionSetEntry source)
    //    {
    //        var transName = JsonConvert.DeserializeObject<Dictionary<string, string>>(source.TranslatedName);
    //        return transName[_lang];
    //    }
    //}
}