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

namespace Web.Repositories
{
    public class AttributeSetRepository : TableStorage<AttributeSetEntry>, IAttributeSetRepository
    {
        public AttributeSetRepository()
            : base(tableName: "AttributeSets")
        {
        }

        public void Add(AttributeSet item)
        {
            // met.1
            //var entity = new DynamicTableEntity();

            //entity.Properties["Name"] = new EntityProperty(item.Name);
            //entity.Properties["Description"] = new EntityProperty(item.Description);
            //entity.PartitionKey = "p";
            //entity.RowKey = Guid.NewGuid().ToString();

            // met.2
            Mapper.CreateMap<AttributeSet, AttributeSetEntry>()
                //.ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.Name.GenerateSlug()))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Attributes)));

            var entity = Mapper.Map<AttributeSet, AttributeSetEntry>(item);



            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<AttributeSet> GetAll(string lang)
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<AttributeSetEntry, AttributeSet>()
                .ForMember(dest => dest.AttributeSetId, opt => opt.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<AttributeValue>>(src.Attributes ?? string.Empty)));
            var entitiesVM = Mapper.Map<List<AttributeSetEntry>, List<AttributeSet>>(entitiesTable.ToList()); //neaparat cu ToList()



            // met asta nu a functionat. La primul apel rezultatul oferit e ok dar la urmatoarele, param. "lang" "revine" la valoarea initiala
            //Mapper.CreateMap<AttributeSetEntry, AttributeSetViewModel>()
            //    .ForMember(dest => dest.AttributeSetId, opt => opt.MapFrom(src => src.RowKey))
            //    .ForMember(dest => dest.TranslatedName, 
            //        opt => opt.ResolveUsing<CustomResolver>().ConstructedBy(() => new CustomResolver(lang))    );               
            //var entitiesVM = Mapper.Map<List<AttributeSetEntry>, List<AttributeSetViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()


            //var entitiesVM = new List<AttributeSetViewModel>();
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

            //    entitiesVM.Add(new AttributeSetViewModel()
            //    {
            //        AttributeSetId = item.RowKey,
            //        Name = newName,
            //        Description = item.Description
            //    });
            //}

            return entitiesVM;
        }

        public AttributeSet GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<AttributeSetEntry, AttributeSet>()
                .ForMember(dest => dest.AttributeSetId, opt => opt.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<AttributeValue>>(src.Attributes ?? string.Empty)));

            return Mapper.Map<AttributeSetEntry, AttributeSet>(entry);
        }

        public void Update(AttributeSet item)
        {
            Mapper.CreateMap<AttributeSet, AttributeSetEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.AttributeSetId))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Attributes)));

            var entity = Mapper.Map<AttributeSet, AttributeSetEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new AttributeSetEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface IAttributeSetRepository : ITableStorage<AttributeSetEntry>
    {
        void Add(AttributeSet item);
        IEnumerable<AttributeSet> GetAll(string lang);
        AttributeSet GetById(string itemId);
        void Update(AttributeSet item);
        void Delete(string itemId);
    }


    //// met. asta nu a functionat ok decat la primul apel -> nu o mai folosesc
    //public class CustomResolver : ValueResolver<AttributeSetEntry, string>
    //{
    //    public string _lang;
    //    public CustomResolver(string lang)
    //    {
    //        _lang = lang;
    //    }

    //    protected override string ResolveCore(AttributeSetEntry source)
    //    {
    //        var transName = JsonConvert.DeserializeObject<Dictionary<string, string>>(source.TranslatedName);
    //        return transName[_lang];
    //    }
    //}
}