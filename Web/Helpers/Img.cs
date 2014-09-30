using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace Web.Helpers
{
    public static class Img
    {
        public static List<AvailableImageSize> GetAvailableImageSizes()
        {
            return new List<AvailableImageSize>()
                {

                    // Atentie!!! 
                    // - daca PreserveAspectRatio=true, atunci seteaza Width si Height
                    // - daca PreserveAspectRatio=false, atunci seteaza MaxSize

                    new AvailableImageSize() //Flickr, Tim Stanley (T.S.), Facebook, Catch.com, Emag(80)
                        {
                            Label = "q", // "Square"
                            MaxSize = 75, // adauga margini albe margini ca sa iasa patrat (nu deformeaza)
                            IsSquare = true
                        },
                    //new AvailableImageSize() //Flickr, Tim Stanley (T.S.), Shopify, PhotoBucktet
                    //    {
                    //        Label = "t", // "Thumb"
                    //        MaxSize = 100
                    //    },
                    //new AvailableImageSize() //Shopify, PhotoBucket, Amazon, Catch.com, Common Web Size(T.S.), Common Thumb Size(T.S.), Palm dim., Emag(150)
                    //    {
                    //        Label = "c", // "Compact"
                    //        MaxSize = 160,
                    //        IsSquare = false
                    //    },
                    //new AvailableImageSize() //Flickr, Shopify, Win.Live Writer(T.S.), Tim Stanley, Common Photo Size(T.S.), Common Web Size(T.S.)
                    //    {
                    //        Label = "s", // "Small"
                    //        MaxSize = 240
                    //    },
                    //new AvailableImageSize() //flickr, picassa, photobucket, emag(300), amazon(300, tim stanley, common photo size(t.s.), common web size(t.s.), cga dim.
                    //    {
                    //        Label = "m", // "medium"
                    //        MaxSize = 320,
                    //        IsSquare = false
                    //    },
                    new AvailableImageSize() //Flickr, Picassa(480), Shopify(480), Amazon, Emag, Catch.com, Tim Stanley, Common Web Size=460(T.S.)
                        {
                            Label = "l", // Large
                            MaxSize = 500,
                            IsSquare = false
                        },
                    //new AvailableImageSize() //este un format f. uzual, dar nu il folosesc //Flickr, Picassa, PhotoBucket, Dropbox, Win.Live Writer(T.S.), VGA dim., Emag=600x600
                    //    {
                    //        Label = "v", // "VeryLarge"
                    //        MaxSize = 640,
                    //        IsSquare = false
                    //    },
                    //new AvailableImageSize() //Flickr, Picassa, PhotoBucket, Tim Stanley, Common Photo Size(T.S.), Common Web Size(T.S.), SVAG dim.
                    //    {
                    //        Label = "b", // Label
                    //        MaxSize = 800
                    //    },
                    new AvailableImageSize() //este un format f. uzual, dar nu il folosesc  //Flickr, Picassa, PhotoBucket, Dropbox, Shopify, Common Photo Size(T.S.), Common Web Size(T.S.), XGA dim., 
                        {
                            Label = "h", // "Huge"
                            MaxSize = 1024,
                            IsSquare = false
                        }

                    // max Emag=2000x2000 (zoom)
                };
        }



        public static bool ConvertStreamToImage(Stream imageStream, out Image image)
        {
            try
            {
                image = Image.FromStream(imageStream);
            }
            catch
            {
                image = null;
                return false;
            }
            return true;
        }

    }

    public class AvailableImageSize
    {
        public bool Active { get; set; } //doar cele active se iau in calcul
        public string Label { get; set; } //t, s, m ...folosit ca sufix la denumirea pozei
        public int MaxSize { get; set; } //valori implicite: t->100, s->240, m-320 ...doar astea admin-ul le poate schimba
        public bool IsSquare { get; set; } // if true, add white space to create a square

    }
}