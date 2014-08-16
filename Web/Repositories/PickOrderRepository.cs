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

namespace Web.Repositories
{
    public class PickOrderRepository : TableStorage<PickOrderEntry>, IPickOrderRepository
    {
        public PickOrderRepository()
            : base(tableName: "PickOrders")
        {
        }

        public void Add(PickOrder item)
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

        public IEnumerable<PickOrder> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<PickOrderEntry, PickOrder>()
                //.ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.PartitionKey))
                .ForMember(dest => dest.PickOrderId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<PickOrderEntry>, List<PickOrder>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public PickOrder GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<PickOrderEntry, PickOrder>()
                .ForMember(dest => dest.PickOrderId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<PickOrderEntry, PickOrder>(entry);
        }

        public void Update(PickOrder item)
        {
            Mapper.CreateMap<PickOrder, PickOrderEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.PickOrderId))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));

            var entity = Mapper.Map<PickOrder, PickOrderEntry>(item);

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
        void Add(PickOrder item);
        IEnumerable<PickOrder> GetAll();
        PickOrder GetById(string itemId);
        void Update(PickOrder item);
        void Delete(string itemId);
    }
}