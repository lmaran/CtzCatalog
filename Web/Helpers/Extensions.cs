﻿// ----------------------------------------------------------------------------------
// lucianmaran@hotmail.com, 19.04.2012, http://maran.ro/2012/04/19/taranul-roman-isi-ia-masina-citroen/
// ----------------------------------------------------------------------------------
// Description:
//      Generate Slug (including accent removing) for a given phrase
// ----------------------------------------------------------------------------------
// Credits:
//      Microsoft Tailspin Project (Codeplex)
// Other variants:
//      Rob Conery, http://stackoverflow.com/questions/2095957/characters-to-strip-out-in-a-seo-clean-uri
//      Azrafe7, http://stackoverflow.com/questions/249087/how-do-i-remove-diacritics-accents-from-a-string-in-net
// ----------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Web.Helpers
{
    public static class Extensions
    {
        // http://maran.ro/2012/04/19/taranul-roman-isi-ia-masina-citroen/
        public static string GenerateSlug(this string txt)
        {
            string str = RemoveAccent(txt).ToLower();

            str = Regex.Replace(str, @"_", "-"); //otherwise, two words separated by '_' become a single word...Dadi

            str = Regex.Replace(str, @"[^a-z0-9\s-]", string.Empty);
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 100 ? str.Length : 100).Trim();
            str = Regex.Replace(str, @"\s", "-");

            str = Regex.Replace(str, @"-+", "-").Trim(); //convert multiple '_' to single '_'
            return str;
        }

        // http://maran.ro/2012/04/19/taranul-roman-isi-ia-masina-citroen/
        private static string RemoveAccent(string txt)
        {
            byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt); //Tailspin uses Cyrillic (ISO-8859-5); others use Hebraw (ISO-8859-8)
            return System.Text.Encoding.ASCII.GetString(bytes);
        }

        // In URL-ul unei resurse web (poza, document etc) vrei sa pastreze punctul din fata extensiei
        public static string GenerateSlugForFilename(this string fileName)
        {
            return Path.GetFileNameWithoutExtension(fileName).GenerateSlug() + Path.GetExtension(fileName).ToLower();
        }

        public static string AppendSizeSufix(this string fileName, string sizeCode)
        {
            string res = null;
            FileInfo fileInfo = new FileInfo(fileName);
            res = Path.GetFileNameWithoutExtension(fileName) + "-" + sizeCode + fileInfo.Extension;
            return res.ToLower();
        }

    }
}