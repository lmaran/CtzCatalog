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

namespace Web.Repositories
{
    public class ProductRepository : TableStorage<ProductEntry>, IProductRepository
    {
        public ProductRepository()
            : base(tableName: "Products")
        {
        }


        public IEnumerable<ProductViewModel> GetByPk()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<ProductEntry, ProductViewModel>()
                //.ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.PartitionKey))
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<ProductEntry>, List<ProductViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }


        public void Add(ProductNew product)
        {
            var entity = new DynamicTableEntity();

            entity.Properties["Name"] = new EntityProperty(product.Name);
            entity.Properties["Description"] = new EntityProperty(product.Description);
            entity.PartitionKey = "p";
            entity.RowKey = Guid.NewGuid().ToString();

            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        //public SpeakerViewModel GetByKeys(String pk, String rk) //pk=EventId; rk=SessionId
        //{

        //    var i = this.Retrieve(pk, rk);
        //    if (i == null) throw new HttpResponseException(HttpStatusCode.NotFound);


        //    // automapper: copy "entitiesTable" to "entitiesVM"
        //    Mapper.CreateMap<SpeakerEntry, SpeakerViewModel>()
        //        .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.PartitionKey))
        //        .ForMember(dest => dest.SpeakerId, opt => opt.MapFrom(src => src.RowKey));

        //    var entityVM = Mapper.Map<SpeakerEntry, SpeakerViewModel>(i);

        //    return entityVM;
        //}


    }


    public interface IProductRepository : ITableStorage<ProductEntry>
    {
        IEnumerable<ProductViewModel> GetByPk();
        void Add(ProductNew product);
        //ProductViewModel GetByKeys(String pk, String rk);
    }
}