using ezSurvey01.Lib;
using System;
using System.Collections.Generic;

namespace ezSurvey01.Models
{
    public class Exam
    {
        public int qnrid { get; set; }

        public string examid { get; set; }

        public List<Record> records { get; set; }

        public DateTime updateDate { get; set; }

        public string updateDateString => Util.formatDateTime(updateDate);

    }

    public class Record
    {
        public string questPId { get; set; }

        public answer[] fillList { get; set; }
    }

    public class answer
    {
        public string ansId { get; set; }
        public string ansText { get; set; }
        public string satisId { get; set; }
    }
}

