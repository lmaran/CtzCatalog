using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;

namespace Web.Controllers
{
    public class ValuesController : ApiController
    {
        public async Task<IHttpActionResult> Get()
        {
            var firstEntry = new DataEntry
            {
                Id = Guid.NewGuid(),
                Name = "First",
                Description = Guid.NewGuid().ToString(),
                Metadata = "{ \"Stuff\": \"148504DC-C57C-4EF2-9497-D7585D2C4998\", \"Created\": \"" + DateTimeOffset.UtcNow + "\", \"Active\": true }"
            };

            var firstSchema = new Dictionary<string, Type>
            {
                {
                    "Stuff", typeof(Guid)
                },
                {
                    "Created", typeof(DateTimeOffset)
                },
                {
                    "Active", typeof(bool)
                }
            };

            var dynamicFirstEntry = new DynamicDataEntry(firstEntry, firstSchema);

            var secondEntry = new DataEntry
            {
                Id = Guid.NewGuid(),
                Name = "Second",
                Description = Guid.NewGuid().ToString(),
                Metadata = "{ \"Price\": 1233, \"ResourceUri\": \"http://www.google.com\"}"
            };

            var secondSchema = new Dictionary<string, Type>
            {
                {
                    "Price", typeof(int)
                },
                {
                    "ResourceUri", typeof(Uri)
                }
            };

            var dynamicSecondEntry = new DynamicDataEntry(secondEntry, secondSchema);

            var result = new[] { dynamicFirstEntry, dynamicSecondEntry };

            return Ok(result);
        }


        private class DataEntry
        {
            public string Name { get; set; }

            public Guid Id { get; set; }

            public string Description { get; set; }

            public string Metadata { get; set; }
        }

        private class DynamicDataEntry : DynamicObject
        {
            private readonly DataEntry _entry;
            private readonly IDictionary<string, string> _entryMetadata;
            private readonly IDictionary<string, Type> _schema;

            public DynamicDataEntry(DataEntry entry, IDictionary<string, Type> schema)
            {
                _entry = entry;
                _schema = schema;
                _entryMetadata = JsonConvert.DeserializeObject<Dictionary<string, string>>(_entry.Metadata);
            }

            public override IEnumerable<string> GetDynamicMemberNames()
            {
                var members = new List<string>(_entryMetadata.Keys);

                members.Add("Id");
                members.Add("Name");
                members.Add("Description");

                return members;
            }

            public override bool TryGetMember(GetMemberBinder binder, out object result)
            {
                if (binder.Name == "Metadata")
                {
                    result = null;
                    return false;
                }

                if (_schema.ContainsKey(binder.Name))
                {
                    var typeConverter = TypeDescriptor.GetConverter(_schema[binder.Name]);

                    result = typeConverter.ConvertFromString(_entryMetadata[binder.Name]);

                    return true;
                }

                var entryProperty = typeof(DataEntry).GetProperty(binder.Name);

                result = entryProperty.GetValue(_entry);
                return true;
            }
        }
    }
}
