using Web.Helpers;
using Web.Models;
using Web.ViewModels;
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
    public class OptionSetRepository : TableStorage<OptionSetEntry>, IOptionSetRepository
    {
        public OptionSetRepository()
            : base(tableName: "OptionSets")
        {
        }

        public void Add(OptionSetNew item)
        {
            //var entity = new DynamicTableEntity();

            //entity.Properties["Name"] = new EntityProperty(item.Name);
            //entity.Properties["Description"] = new EntityProperty(item.Description);
            //entity.PartitionKey = "p";
            //entity.RowKey = Guid.NewGuid().ToString();

            // met.2
            Mapper.CreateMap<OptionSetNew, OptionSetEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));
                //.ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.)));

            var entity = Mapper.Map<OptionSetNew, OptionSetEntry>(item);

            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<OptionSetViewModel> GetAll(string lang)
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<OptionSetEntry, OptionSetViewModel>()
                .ForMember(dest => dest.OptionSetId, opt => opt.MapFrom(src => src.RowKey));

            var entitiesVM = Mapper.Map<List<OptionSetEntry>, List<OptionSetViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

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

        public OptionSetViewModel GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<OptionSetEntry, OptionSetViewModel>()
                .ForMember(dest => dest.OptionSetId, opt => opt.MapFrom(src => src.RowKey));
                //.ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<Option>>(src.Options ?? string.Empty)));

            return Mapper.Map<OptionSetEntry, OptionSetViewModel>(entry);
        }

        public void Update(OptionSetViewModel item)
        {
            Mapper.CreateMap<OptionSetViewModel, OptionSetEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.OptionSetId))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));
                //.ForMember(dest => dest.Options, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.Options)));

            var entity = Mapper.Map<OptionSetViewModel, OptionSetEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new OptionSetEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface IOptionSetRepository : ITableStorage<OptionSetEntry>
    {
        void Add(OptionSetNew item);
        IEnumerable<OptionSetViewModel> GetAll(string lang);
        OptionSetViewModel GetById(string itemId);
        void Update(OptionSetViewModel item);
        void Delete(string itemId);
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