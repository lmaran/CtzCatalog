using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    // imgUrl = RootUrl + Name
    // ex: http://cortizo.blob.core.windows.net/images/891839484-boston-city-flow-q.jpg
    // note that all names ends with a label code


    public class ImageMeta
    {
        public string RootUrl { get; set; } // ex: http://cortizo.blob.core.windows.net/images
        public string Name { get; set; } // ex: 891757687-graffiti.jpg (no label)...for delete op. it works like an ID 
        //public List<ImageSize> Sizes { get; set; }
        public List<String> Sizes { get; set; }
    }

    //public class ImageSize
    //{
    //    //ca la Facebook http://developers.facebook.com/docs/reference/api/photo/
    //    //sau Flickr http://www.flickr.com/services/api/flickr.photos.getSizes.html

    //    public string Name { get; set; } //ex: 891839484-boston-city-flow-q.jpg (all names ends with a label code)
    //    public string Label { get; set; } // one letter: t-(Thumb), s-(Small), m-(Medium), l-(Large), o-(Original)
    //    public string Width { get; set; }
    //    public string Height { get; set; }
    //    public long Size { get; set; }

    //}
}