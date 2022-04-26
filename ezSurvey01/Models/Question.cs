using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezSurvey01.Models
{
    public class Question
    {
        public string questPId { get; set; }
        public int questId { get; set; }
        public string questType { get; set; }
        public string questContent { get; set; }
        public List<QuestItem> options { get; set; }
        public List<QuestItem> satisQuests { get; set; }
    }

    public class QuestItem
    {
        public string id { get; set; }
        public int order { get; set; }
        public string content { get; set; }
        public string hasAppendText { get; set; }
    }
}
