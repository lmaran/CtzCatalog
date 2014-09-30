using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Web;

namespace Web.Helpers
{
    public static class ResizeImage
    {
        //de aici: http://snipplr.com/view/43917/aspnet-image-upload-and-resize/
        //alta sursa: http://www.codeproject.com/Articles/191424/Resizing-an-Image-On-The-Fly-using-NET?display=PrintAll
        //metoda Darin Dimitrov: http://stackoverflow.com/questions/7548028/stream-to-image-and-back
        // sau Gunnar Peipman http://weblogs.asp.net/gunnarpeipman/archive/2009/04/02/resizing-images-without-loss-of-quality.aspx

        public static Image ResizeFromImage2(Image originalImage, AvailableImageSize desiredSize)
        {

            int finalW;  //final width
            int finalH; // final height

            int intMaxSide;
            intMaxSide = Math.Max(originalImage.Width, originalImage.Height);

            if (intMaxSide > desiredSize.MaxSize)
            {
                double scaleFactor = desiredSize.MaxSize / (double)intMaxSide;
                finalW = (int)(originalImage.Width * scaleFactor);
                finalH = (int)(originalImage.Height * scaleFactor);
            }
            else
            {
                finalW = originalImage.Width;
                finalH = originalImage.Height;
            }

            Image bmp = new Bitmap(finalW, finalH); //imaginea nu pot sa o pun in "using" daca vreau sa o returnez...altfel se "inchide" automat inainte de a parasi procedura

            using (var graphics = Graphics.FromImage(bmp))
            {
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;

                graphics.DrawImage(originalImage, new Rectangle(0, 0, finalW, finalH));
            }

            //imgInput.Dispose(); //am pierdut 1h ca sa descopar ca nu pot elibera aceasta imagine, pt. ca o mai foloses...este de fapt originalImage...fac la sfarsit, in repository
            return bmp;
        }

        public static Image ResizeFromImage(Image originalImage, AvailableImageSize desiredSize)
        {

            int finalW;  //final width
            int finalH; // final height

            int intMaxSide;
            intMaxSide = Math.Max(originalImage.Width, originalImage.Height);

            if (intMaxSide > desiredSize.MaxSize)
            {
                double scaleFactor = desiredSize.MaxSize / (double)intMaxSide;
                finalW = (int)(originalImage.Width * scaleFactor);
                finalH = (int)(originalImage.Height * scaleFactor);
            }
            else
            {
                finalW = originalImage.Width;
                finalH = originalImage.Height;
            }


            Size boxSize = new Size();
            if (desiredSize.IsSquare)
            {
                boxSize.Width = desiredSize.MaxSize;
                boxSize.Height = desiredSize.MaxSize;
            }
            else
            {
                boxSize.Width = finalW;
                boxSize.Height = finalH;
            }

            //Size squareSize = new Size(desiredSize.MaxSize, desiredSize.MaxSize);
            Image squareImage = new Bitmap(boxSize.Width, boxSize.Height); //imaginea nu pot sa o pun in "using" daca vreau sa o returnez...altfel se "inchide" automat inainte de a parasi procedura

            using (var graphics = Graphics.FromImage(squareImage))
            {               
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;

                graphics.FillRectangle(Brushes.White, 0, 0, boxSize.Width, boxSize.Height);

                var upperLeftX = (boxSize.Width - finalW) / 2;
                var upperLeftY = (boxSize.Height - finalH) / 2;
                
                graphics.DrawImage(originalImage, new Rectangle(upperLeftX, upperLeftY, finalW, finalH));
            }

            //imgInput.Dispose(); //am pierdut 1h ca sa descopar ca nu pot elibera aceasta imagine, pt. ca o mai foloses...este de fapt originalImage...fac la sfarsit, in repository
            return squareImage;
        }

    }
}