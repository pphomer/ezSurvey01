using ezSurvey01.Models;
using ezSurvey01.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Utility;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ezSurvey01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IQNRRepository qnrrepository;
        private readonly IExamRepository examRepository;
        
        public ExamController(IQNRRepository qnrrepository, IExamRepository examRepository)
        {
            this.qnrrepository=qnrrepository;
            this.examRepository=examRepository;
        }

        [HttpGet("/api/examlist/{qnrid}")]
        public ActionResult GetExamList(int qnrid)
        {
            var qnr = this.qnrrepository.GetQuestionnaire(qnrid);

            if( qnr?.qnrid == qnrid)
            {
                return Ok(this.examRepository.GetAllExam(qnrid).ToList());
            }

            return NotFound();
        }

        [HttpGet("{qnrid}/{examid?}")]
        public object GetExam(int qnrid, string examid)
        {
            Exam exam = null;

            Func<bool> hasexamid = () => !string.IsNullOrEmpty(examid);

            if (hasexamid())
            {
                exam = this.examRepository.GetExam(qnrid, examid);
            }

            if (exam == null)
            {
                var qnr = this.qnrrepository.GetQuestionnaire(qnrid);

                exam = new Exam
                {
                    qnrid = qnr?.qnrid ?? 0,
                };
            }

            return exam;
        }

        // POST api/<SurveyController>
        [HttpPost("{qnrid}")]
        public object updateExam(int qnrid, Exam exam)
        {
            object result = examRepository.Update(exam);

            return result;
        }       
    }
}
