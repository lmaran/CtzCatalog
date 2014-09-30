//using Web.Helpers;
//using Web.Models;
//using AutoMapper;
//using Microsoft.WindowsAzure.Storage.Table;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Web;
//using System.Web.Http;
//using System.Linq.Expressions;
//using Attribute = Web.Models.Attribute; // Type alias

//namespace Web.Repositories
//{
//    public class AttributeRepository : TableStorage<AttributeEntry>, IAttributeRepository
//    {
//        public AttributeRepository()
//            : base(tableName: "Attributes")
//        {
//        }

//        public void Add(Attribute item)
//        {
//            // met.1
//            //var entity = new DynamicTableEntity();
//            //entity.Properties["Name"] = new EntityProperty(item.Name);
//            //entity.Properties["Description"] = new EntityProperty(item.Description);
//            //entity.Properties["Type"] = new EntityProperty(item.Type);
//            //entity.Properties["TypeDetails"] = new EntityProperty(item.TypeDetails);
//            //entity.PartitionKey = "p";
//            //entity.RowKey = Guid.NewGuid().ToString();

//            // met.2
//            Mapper.CreateMap<Attribute, AttributeEntry>()
//                //.ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
//                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.Name.GenerateSlug()))
//                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));
//            //.ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.)));
//            var entity = Mapper.Map<Attribute, AttributeEntry>(item);

//            // entity.ETag = "*"; // mandatory for <merge>
//            // var operation = TableOperation.Merge(entity);
//            var operation = TableOperation.Insert(entity);
//            Table.Execute(operation);
//        }

//        public IEnumerable<Attribute> GetAll(string lang)
//        {
//            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
//            var entitiesTable = this.ExecuteQuery(filter);

//            // automapper: copy "entitiesTable" to "entitiesVM"
//            Mapper.CreateMap<AttributeEntry, Attribute>()
//                .ForMember(dest => dest.AttributeId, opt => opt.MapFrom(src => src.RowKey));
//            var entitiesVM = Mapper.Map<List<AttributeEntry>, List<Attribute>>(entitiesTable.ToList()); //neaparat cu ToList()


//            // met asta nu a functionat. La primul apel rezultatul oferit e ok dar la urmatoarele, param. "lang" "revine" la valoarea initiala
//            //Mapper.CreateMap<AttributeEntry, AttributeViewModel>()
//            //    .ForMember(dest => dest.AttributeId, opt => opt.MapFrom(src => src.RowKey))
//            //    .ForMember(dest => dest.TranslatedName, 
//            //        opt => opt.ResolveUsing<CustomResolver>().ConstructedBy(() => new CustomResolver(lang))    );               
//            //var entitiesVM = Mapper.Map<List<AttributeEntry>, List<AttributeViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

//            //var entitiesVM = new List<AttributeViewModel>();
//            //foreach (var item in entitiesTable)
//            //{

//            //    var newName = item.Name;
//            //    if (lang != null && !string.IsNullOrEmpty(item.TranslatedName))
//            //    {
//            //        string translatedName;
//            //        var transDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(item.TranslatedName);
//            //        if (transDictionary.TryGetValue(lang, out translatedName))
//            //            newName = translatedName;
//            //    }

//            //    entitiesVM.Add(new AttributeViewModel()
//            //    {
//            //        AttributeId = item.RowKey,
//            //        Name = newName,
//            //        Description = item.Description
//            //    });
//            //}

//            return entitiesVM;
//        }

//        public Attribute GetById(string itemId)
//        {
//            var entry = this.Retrieve("p", itemId);

//            Mapper.CreateMap<AttributeEntry, Attribute>()
//                .ForMember(dest => dest.AttributeId, opt => opt.MapFrom(src => src.RowKey));
//                //.ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<AttributeValue2>>(src.Attributes ?? string.Empty)));

//            return Mapper.Map<AttributeEntry, Attribute>(entry);
//        }

//        public void Update(Attribute item)
//        {
//            Mapper.CreateMap<Attribute, AttributeEntry>()
//                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.AttributeId))
//                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));
//                //.ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Attributes)));

//            var entity = Mapper.Map<Attribute, AttributeEntry>(item);

//            entity.ETag = "*"; // mandatory for <replace>
//            var operation = TableOperation.Replace(entity);
//            Table.Execute(operation);
//        }

//        public void Delete(string itemId)
//        {
//            var item = new AttributeEntry();
//            item.PartitionKey = "p";
//            item.RowKey = itemId;
//            this.Delete(item);
//        }

//    }


//    public interface IAttributeRepository : ITableStorage<AttributeEntry>
//    {
//        void Add(Attribute item);
//        IEnumerable<Attribute> GetAll(string lang);
//        Attribute GetById(string itemId);
//        void Update(Attribute item);
//        void Delete(string itemId);
//    }


//    //// met. asta nu a functionat ok decat la primul apel -> nu o mai folosesc
//    //public class CustomResolver : ValueResolver<AttributeEntry, string>
//    //{
//    //    public string _lang;
//    //    public CustomResolver(string lang)
//    //    {
//    //        _lang = lang;
//    //    }

//    //    protected override string ResolveCore(AttributeEntry source)
//    //    {
//    //        var transName = JsonConvert.DeserializeObject<Dictionary<string, string>>(source.TranslatedName);
//    //        return transName[_lang];
//    //    }
//    //}
//}