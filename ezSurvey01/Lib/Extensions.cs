using Microsoft.AspNetCore.Http;
using System.Text;

namespace ezSurvey01.Lib
{
    public static class Extensions
    {
        //public static void SetString(this ISession session, string key, string value)
        //{
        //    session.SetString(key, value);
        //    //session.Set( (key, Encoding.UTF8.GetBytes(value));
        //}

        public static bool GetString(this ISession session, string key, out string value)
        {
            value = "";

            if (session.TryGetValue(key, out byte[] result))
            {
                value = Encoding.UTF8.GetString(result);
            }

            return value != "";
        }
    }
}
