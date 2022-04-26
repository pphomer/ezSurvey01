using ezSurvey01.Lib;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using static ezSurvey01.Models.DateCompareAttribute;

namespace ezSurvey01.Models
{
    public class Questionnaire
    {
        public int qnrid { get; set; }

        [Requiredzh]
        [StringLengthzh(300)]
        [Display(Name = "問卷名稱")]
        public string title { get; set; }

        public string description { get; set; }

        [Requiredzh]
        [Display(Name = "活動起日")]
        public DateTime? startDate { get; set; }

        [Requiredzh]
        [DateCompare(nameof(startDate), EnumDateCompare.gt, CompareType.Date, ErrorMessage = "活動迄日期需大於活動起日期")]
        [Display(Name = "活動迄日")]
        public DateTime? endDate { get; set; }
        public IFormFile newBannerImg { get; set; }

        public string period { get => $"{Util.formatDateTime(startDate)}-{Util.formatDateTime(endDate)}"; }

        public string bannerImg_clientName { get; set; }
        public string bannerImg_Url { get; set; }
        public bool bannerImgDeleted { get; set; } = false;

        [StringLength(200)]
        public string banner_img { get; set; }
        public string updateUser { get; set; }

        public List<Question> questList { get; set; } = new List<Question>();
        public string jquestList { get; set; }
        public DateTime updateDate { get; set; }
        
        
    }
}
