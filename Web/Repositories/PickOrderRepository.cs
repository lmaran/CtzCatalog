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
    public class PickOrderRepository : TableStorage<PickOrderEntry>, IPickOrderRepository
    {
        public PickOrderRepository()
            : base(tableName: "PickOrders")
        {
        }

        public void Add(PickOrderNew item)
        {
            var entity = new DynamicTableEntity();

            entity.Properties["Name"] = new EntityProperty(item.Name);
            entity.Properties["CreatedOn"] = new EntityProperty(item.CreatedOn);
            entity.Properties["CustomerId"] = new EntityProperty(item.CustomerId);
            entity.Properties["CustomerName"] = new EntityProperty(item.CustomerName);
            entity.PartitionKey = "p";
            entity.RowKey = Guid.NewGuid().ToString();

            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<PickOrderViewModel> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<PickOrderEntry, PickOrderViewModel>()
                //.ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.PartitionKey))
                .ForMember(dest => dest.PickOrderId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<PickOrderEntry>, List<PickOrderViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public PickOrderViewModel GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<PickOrderEntry, PickOrderViewModel>()
                .ForMember(dest => dest.PickOrderId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<PickOrderEntry, PickOrderViewModel>(entry);
        }

        public void Update(PickOrderViewModel item)
        {
            Mapper.CreateMap<PickOrderViewModel, PickOrderEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.PickOrderId))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));

            var entity = Mapper.Map<PickOrderViewModel, PickOrderEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new PickOrderEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface IPickOrderRepository : ITableStorage<PickOrderEntry>
    {
        void Add(PickOrderNew item);
        IEnumerable<PickOrderViewModel> GetAll();
        PickOrderViewModel GetById(string itemId);
        void Update(PickOrderViewModel item);
        void Delete(string itemId);
    }
}