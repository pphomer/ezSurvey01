using System;

namespace Utility
{
    public class commonUtil
    {
        public static bool IsDateTime(object datetime, ref DateTime dateTime)
        {
            bool bdatetime = false;

            if (datetime is DateTime)
            {
                bdatetime = true;
                dateTime = (DateTime)datetime;
            }
            else
            {
                var strdatetime = datetime?.ToString();

                if (!string.IsNullOrEmpty(strdatetime) && DateTime.TryParse(strdatetime, out DateTime outdateTime))
                {
                    bdatetime = true;
                    dateTime = outdateTime;
                }
            }

            return bdatetime;
        }

        public static int DiffDays(DateTime endDate, DateTime startDate)
        {
            return (int)(endDate.Date - startDate.Date).TotalDays;
        }
    }
}
