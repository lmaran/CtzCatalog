using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions; // Type alias
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;
using Attribute = Web.Models.Attribute;

namespace Web.Repositories.Mongo
{
	public partial class MongoContext
	{
        private static void RegisterConventions()
        {
            // conventions for all types - http://pragmateek.com/reduce-the-size-of-mongodb-documents-generated-from-netc/
            ConventionPack pack = new ConventionPack();
            pack.Add(new IgnoreIfNullConvention(true)); // ignore nullable MongoDB fields
            pack.Add(new IgnoreExtraElementsConvention(true)); // ignore MongoDB fields which do dot have corresponding C# properties; otherwise we get an error at deserialization

            ConventionRegistry.Register("Ignore null properties and extra elements", pack, type => true);

            // register conventions only for a specific Type:
            //ConventionRegistry.Register("Ignore null properties of data", pack, type => type == typeof(ProductAttribute));

            BsonClassMap.RegisterClassMap<Entity>(cm =>
            {
                cm.AutoMap();

                //cm.SetIdMember(cm.GetMemberMap(c => c.Id)); // if the key name <> "Id"

                // http://stackoverflow.com/a/24351900/2726725
                cm.IdMemberMap.SetRepresentation(BsonType.ObjectId);
                //cm.IdMemberMap.SetIdGenerator(StringObjectIdGenerator.Instance);

                // Ignore Extra Elements
                cm.SetIgnoreExtraElements(true);
            });

            //BsonClassMap.RegisterClassMap<Attribute>(cm =>
            //{
            //    cm.AutoMap();

            //    cm.SetIgnoreExtraElements(true); // Ignore Extra Elements

            //    //cm.GetMemberMap(c => c.Options).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.AllowMultiple).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfDefault(true);

            //    // attributes with "Text" type does not have this field in DB, so we don't want to see this property (in deserialized objects) when we query for data
            //    // we have also to set this property as nullable in the corresponding class
            //    // details: http://stackoverflow.com/a/4895977/2726725
            //    //cm.SetIgnoreExtraElements(true); 

            //    //cm.SetExtraElementsMember(cm.GetMemberMap(c => c.Values));

            //    //cm.GetMemberMap(c => c.Metadata).SetElementName(MongoConstants.Fields.DataEntity.Metadata).SetIgnoreIfNull(true);
            //});

            //BsonClassMap.RegisterClassMap<ProductAttribute>(cm =>
            //{
            //    cm.AutoMap();

            //    //cm.GetMemberMap(c => c.Description).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.Value).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.Values).SetIgnoreIfNull(true);


            //    //cm.GetMemberMap(c => c.AllowMultiple).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfNull(true);
            //    //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfDefault(true);

            //    // attributes with "Text" type does not have this field in DB, so we don't want to see this property (in deserialized objects) when we query for data
            //    // we have also to set this property as nullable in the corresponding class
            //    // details: http://stackoverflow.com/a/4895977/2726725
            //    //cm.SetIgnoreExtraElements(true); 

            //    //cm.SetExtraElementsMember(cm.GetMemberMap(c => c.Values));

            //    //cm.GetMemberMap(c => c.Metadata).SetElementName(MongoConstants.Fields.DataEntity.Metadata).SetIgnoreIfNull(true);
            //});
        }
	}
}