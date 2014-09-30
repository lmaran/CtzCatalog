using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class BlobTransportObject
    {
        //for input
        //public long Id { get; set; } //id-ul unic al fisierului
        public string Name { get; set; }
        //public string MimeType { get; set; }

        //output
        public string Source { get; set; } // url-ul direct catre resursa jpg/gif ... Ex: http://solution4.blob.core.windows.net/eta2u/970116372-graffiti.jpg
        public long Size { get; set; }
        //public DateTime CreatedOn { get; set; }
    }
}