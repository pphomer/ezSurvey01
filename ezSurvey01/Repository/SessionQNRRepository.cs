using ezSurvey01.Lib;
using ezSurvey01.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace ezSurvey01.Repository
{
    public class SessionQNRRepository : FileQNRRepository
    {
        const string CONST_QNRList = "QNRList";
        private readonly IHttpContextAccessor httpContextAccessor;

        protected override List<Questionnaire> QNRList
        {
            get
            {
                if (this.httpContextAccessor.HttpContext.Session.GetString(CONST_QNRList, out string qnrs))
                {
                    return JToken.Parse(qnrs).ToObject<List<Questionnaire>>();
                }
                return _QNRList;
            }
            
            set {
                this.httpContextAccessor.HttpContext.Session.SetString(CONST_QNRList,
                    JToken.FromObject(value).ToString());
            }            
        } 

        public SessionQNRRepository(IHttpContextAccessor httpContextAccessor)
            :base()
        {
            this.httpContextAccessor=httpContextAccessor;
        }
    }

    public class SessionExamRepository : FileExamRepository
    {        
        const string CONST_ExamList = "ExamList";

        private readonly IHttpContextAccessor httpContextAccessor;

        protected override List<Exam> ExamList
        {
            get
            {
                if (this.httpContextAccessor.HttpContext.Session.GetString(CONST_ExamList, out string examlist))
                {
                    return JToken.Parse(examlist).ToObject<List<Exam>>();
                }
                return _ExamList;
            }
            set
            {
                this.httpContextAccessor.HttpContext.Session.SetString(CONST_ExamList,
                    JToken.FromObject(value).ToString());
            }
        }

        public SessionExamRepository(IHttpContextAccessor httpContextAccessor)
            :base()
        {
            this.httpContextAccessor=httpContextAccessor;            
        }
    }
}
