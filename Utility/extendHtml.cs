using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Utility
{
    public static class extendHtml
    {
        static string[] escapeDefaultTags = { "<sup>", "</sup>", "<p>", "</p>", "<sub>", "</sub>", "<br/>" }; // "<strong>", "</strong>", "<br />", "<br/>", "<h4>", "</h4>"

        const string scriptPattern = @"<script[^>]*>[\s\S]*?</script>";

        public static string trimScript(this string text)
        {
            var remscript = Regex.Replace(text, scriptPattern, "");

            return remscript;
        }

        public static string trimAllTags(this string text)
        {
            return Regex.Replace(text, "<.*?>", string.Empty);
        }

        public static string trimTags(this string text, params string[] tags)
        {
            if (tags != null && tags.Length > 0)
            {
                return trimExplicitTags(text, tags);
            }

            return trimAllTags(text);
        }

        public static string trimExplicitTags(this string text, params string[] tags)
        {
            var _tags = tags.Where(t => !string.IsNullOrEmpty(t));

            Func<string, string> tagPattern = tag => $@"<\/?{tag}( [^>]*)?>";

            var resultText = text;

            foreach (var _tag in _tags)
            {
                resultText = Regex.Replace(text, tagPattern(_tag), string.Empty, RegexOptions.IgnoreCase);
            }

            return resultText;
        }

        public static string trimTagSpace(this string text)
        {
            var trimstr = trimSpace(text.trimTags());
            return trimstr;
        }

        public static string trimSpace(this string text)
        {
            var trimstr = Regex.Replace(text, @"\&nbsp;|\s", string.Empty);
            return trimstr;
        }


        public static string HtmlDecode(this string text)
        {
            return HttpUtility.HtmlDecode(text);
        }


    }
}
