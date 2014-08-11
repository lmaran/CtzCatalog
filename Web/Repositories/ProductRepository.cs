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

        public void Add(ProductNew item)
        {
            var entity = new DynamicTableEntity();

            entity.Properties["Name"] = new EntityProperty(item.Name);
            entity.Properties["Description"] = new EntityProperty(item.Description);
            entity.Properties["AttributeSetId"] = new EntityProperty(item.AttributeSetId);
            entity.Properties["AttributeSetName"] = new EntityProperty(item.AttributeSetName);
            entity.Properties["Attributes"] = new EntityProperty(item.Attributes);
            entity.PartitionKey = "p";
            entity.RowKey = Guid.NewGuid().ToString();

            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<ProductViewModel> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<ProductEntry, ProductViewModel>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<ProductEntry>, List<ProductViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public ProductViewModel GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<ProductEntry, ProductViewModel>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<ProductEntry, ProductViewModel>(entry);
        }

        public void Update(ProductViewModel item)
        {
            Mapper.CreateMap<ProductViewModel, ProductEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.PartitionKey, opt=> opt.UseValue("p"));

            var entity = Mapper.Map<ProductViewModel, ProductEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new ProductEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface IProductRepository : ITableStorage<ProductEntry>
    {
        void Add(ProductNew item);
        IEnumerable<ProductViewModel> GetAll();
        ProductViewModel GetById(string itemId);
        void Update(ProductViewModel item);
        void Delete(string itemId);
    }
}