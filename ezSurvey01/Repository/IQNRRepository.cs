using ezSurvey01.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezSurvey01.Repository
{
    public interface IQNRRepository
    {
        IEnumerable<Questionnaire> GetAllQuestionnaires();
        Questionnaire GetQuestionnaire(int? qnrid);
        Questionnaire Update(Questionnaire updatedQNR);
        int Copy(int qnrid); 
        bool Delete(int qnrid);
    }

    public interface IExamRepository
    {
        IEnumerable<Exam> GetAllExam(int qnrid);
        Exam GetExam(int qnrid, string examid);
        Exam Update(Exam updatedExam);
        bool Delete(int qnrid);
        bool Delete(int qnrid, string examid);
    }
}
