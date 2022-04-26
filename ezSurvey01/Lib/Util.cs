using System;

namespace ezSurvey01.Lib
{
    public class Util
    {
        public static string formatDateTime(DateTime? dateTime)
        {
            return dateTime.HasValue ? dateTime.Value.ToString("yyyy/MM/dd HH:mm") : null;
        }
    }
}
