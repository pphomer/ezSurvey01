using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Diagnostics;

namespace Utility
{
    public class jsonHelper
    {
        public static string toJsonString(object jparam)
        {
            string jstring = null;

            if (jparam is string)
            {
                jstring = (string)jparam;
            }
            else if (jparam is JObject)
            {
                jstring = jparam.ToString();
            }
            else if (jparam != null)
            {
                jstring = JsonConvert.SerializeObject(jparam, Formatting.Indented);
            }

            Debug.WriteLine(jstring);

            return jstring;
        }

        public static string[] toJsonStrings(params object[] jparams)
        {
            List<string> jstrings = new List<string>(jparams.Length);

            foreach (object jparam in jparams)
            {
                var _jparam = jparam ?? new JObject();

                jstrings.Add(toJsonString(_jparam));
            }

            return jstrings.ToArray();
        }

    }
}
