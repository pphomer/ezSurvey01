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
    public class FileQNRRepository : IQNRRepository
    {
        protected const string JQNR = "QNR.json";

        protected virtual List<Questionnaire> QNRList
        {
            get => _QNRList;
            set
            {
                _QNRList = value;
                File.WriteAllText(JQNR, JToken.FromObject(_QNRList).ToString());
            }
        }

        protected List<Questionnaire> _QNRList = null;

        public FileQNRRepository()
        {
            if (!File.Exists(JQNR))
            {
               File.Create(JQNR);
            }

            var qnrs = File.ReadAllText(JQNR);

            qnrs = qnrs == "" ? "[]" : qnrs;

            _QNRList = JToken.Parse(qnrs).ToObject<List<Questionnaire>>();
        }

        public IEnumerable<Questionnaire> GetAllQuestionnaires()
        {
            return QNRList;
        }

        public Questionnaire GetQuestionnaire(int? qnrid)
        {
            Questionnaire qnr = null;

            if (qnrid.HasValue)
            {
                qnr = QNRList.FirstOrDefault(q => q.qnrid == qnrid);
            }

            return qnr ?? new Questionnaire();
        }

        
        public Questionnaire Update(Questionnaire QNR)
        {
            QNR.updateDate = DateTime.Now;

            var _qnr = QNRList.FirstOrDefault(q => q.qnrid == QNR.qnrid);

            if (_qnr == null)
            {
                QNR.qnrid = genQNRID();
                QNRList = QNRList.Append(QNR).ToList();
            }
            else
            {
                QNRList = QNRList.Where(q => q.qnrid != QNR.qnrid).Append(QNR).ToList();
            }

            return QNR;
        }

        private int genQNRID() => QNRList.Count() == 0 ? 1 : QNRList.Max(q => q.qnrid) + 1;

        public int Copy(int QNRID)
        {
            var qnr = QNRList.FirstOrDefault(q => q.qnrid == QNRID);
            if (qnr != null)
            {
                var sqnr = JsonConvert.SerializeObject(qnr);
                var newqnr = JsonConvert.DeserializeObject<Questionnaire>(sqnr);
                newqnr.qnrid = 0;
                return Update(newqnr).qnrid;
            }

            return 0;
        }

        public bool Delete(int QNRID)
        {
            var _qnr = QNRList.FirstOrDefault(q => q.qnrid == QNRID);
            if(_qnr != null)
            {
                QNRList = QNRList.Where(q => q.qnrid != QNRID).ToList();
            }
            return _qnr != null;
        }        
    }

    public class FileExamRepository : IExamRepository
    {
        protected const string JExam = "Exam.json";
        protected List<Exam> _ExamList = null;

        protected virtual  List<Exam> ExamList
        {
            get => _ExamList;
            set
            {
                _ExamList = value;
                // Console.WriteLine(JToken.FromObject(_QNRList).ToString());
                File.WriteAllText(JExam, JToken.FromObject(_ExamList).ToString());
            }
        }
        
        public FileExamRepository()
        {
            if (!File.Exists(JExam))
            {
                File.Create(JExam);
            }

            var exams = File.ReadAllText(JExam);

            exams = exams == "" ? "[]" : exams;

            _ExamList = JToken.Parse(exams).ToObject<List<Exam>>();
        }


        public IEnumerable<Exam> GetAllExam(int qnrid)
        {
            return ExamList.Where(e => e.qnrid == qnrid);
        }

        public Exam GetExam(int qnrid, string examid)
        {
            return ExamList.Where(e => e.qnrid == qnrid && e.examid == examid).FirstOrDefault();
        }

        public Exam Update(Exam updatedExam)
        {
            updatedExam.updateDate = DateTime.Now;

           var newlist = ExamList.Where(e => e.qnrid != updatedExam.qnrid || e.examid != updatedExam.examid)
                                 .Append(updatedExam).ToList();
                      
            ExamList = newlist;

            return updatedExam;
        }

        public bool Delete(int qnrid)
        {
            var _exam = ExamList.FirstOrDefault(e => e.qnrid == qnrid);

            if (_exam != null)
            {
                ExamList = ExamList.Where(q => q.qnrid != qnrid).ToList();
            }
            return _exam != null;
        }

        public bool Delete(int qnrid, string examid)
        {
            var _exam = ExamList.FirstOrDefault(e => e.qnrid == qnrid
                                                  && e.examid == examid);

            if (_exam != null)
            {
                ExamList = ExamList.Where(e => e.qnrid != qnrid
                                            || e.examid != examid).ToList();
            }
            return _exam != null;
        }
    }

    
}
