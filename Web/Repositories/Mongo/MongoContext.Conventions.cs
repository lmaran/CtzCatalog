using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;
using Attribute = Web.Models.Attribute; // Type alias

namespace Web.Repositories.Mongo
{
	public partial class MongoContext
	{
        private static void RegisterConventions()
        {
            BsonClassMap.RegisterClassMap<Entity>(cm =>
            {
                cm.AutoMap();

                //cm.SetIdMember(cm.GetMemberMap(c => c.OtherId)); // if the key name <> "Id"

                // http://stackoverflow.com/a/24351900/2726725
                cm.IdMemberMap.SetRepresentation(BsonType.ObjectId);
                cm.IdMemberMap.SetIdGenerator(StringObjectIdGenerator.Instance);

                

                // Ignore Extra Elements
                cm.SetIgnoreExtraElements(true);
            });

            BsonClassMap.RegisterClassMap<Attribute>(cm =>
            {
                cm.AutoMap();

                //cm.GetMemberMap(c => c.Options).SetIgnoreIfNull(true);
                //cm.GetMemberMap(c => c.AllowMultiple).SetIgnoreIfNull(true);
                //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfNull(true);
                //cm.GetMemberMap(c => c.AllowCustomValues).SetIgnoreIfDefault(true);

                // attributes with "Text" type does not have this field in DB, so we don't want to see this property (in deserialized objects) when we query for data
                // we have also to set this property as nullable in the corresponding class
                // details: http://stackoverflow.com/a/4895977/2726725
                //cm.SetIgnoreExtraElements(true); 
                
                //cm.SetExtraElementsMember(cm.GetMemberMap(c => c.Values));

                //cm.GetMemberMap(c => c.Metadata).SetElementName(MongoConstants.Fields.DataEntity.Metadata).SetIgnoreIfNull(true);
            });
        }
	}
}