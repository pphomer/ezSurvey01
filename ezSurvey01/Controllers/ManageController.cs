using ezSurvey01.Models;
using ezSurvey01.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using survey2021.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Utility;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ezSurvey01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IQNRRepository qnrrepository;
        private readonly IExamRepository examRepository;
        private readonly ManageSettings manageSettings;
        private readonly FileUtil fileUtil;

        public ManageController(IConfiguration config, ManageSettings manageSettings, IQNRRepository qnrrepository, IExamRepository examRepository)
        {            
            this.config = config;
            this.qnrrepository = qnrrepository;
            this.examRepository=examRepository;
            this.manageSettings = manageSettings;
            this.fileUtil = new FileUtil(config);

        }

        // GET: api/<QNRController>
        [HttpGet("/api/QNRList")]
        public IEnumerable<Questionnaire> Get()
        {
            return this.qnrrepository.GetAllQuestionnaires();
        }

        // GET api/<QNRController>/5
        [HttpGet("/api/QNR/{id?}")]
        public Questionnaire GetQNR(int? id)
        {
            return this.qnrrepository.GetQuestionnaire(id);
        }

        // POST api/<QNRController>
        [HttpPost("/api/QNR")]
        public void Post([FromForm] Questionnaire qnr)
        {
            Console.WriteLine(qnr);
        }

        [HttpPost("/api/updateQNR")]
        
        public async Task<object> updateQNR([FromForm] Questionnaire QNR)
        {
            return await saveQNR(QNR);
        }                

        private ActionResult validation()
        {
            if (!ModelState.IsValid)
            {
                addValidSummary<Questionnaire>();

                return ValidationProblem(ModelState);
            }

            return Ok(new { validation = "OK" });
        }

        private async Task<object> saveQNR(Questionnaire postQNR)
        {
            var valided = validation();

            if (valided is OkObjectResult)
            {
                postQNR = await prepareNormalData(postQNR);

                return qnrrepository.Update(postQNR);
            }

            return valided;

            // ModelState.Errors not work 
            // https://docs.microsoft.com/zh-tw/dotnet/api/system.web.mvc.modelstate.errors?view=aspnet-mvc-5.2 
        }
        
        private async Task<Questionnaire> prepareNormalData(Questionnaire qnrObj)
        {
            qnrObj.questList = JToken.Parse(qnrObj.jquestList).ToObject<List<Question>>();
            // 
            if (qnrObj.bannerImgDeleted)
            {
                qnrObj = await resetBannerImg(qnrObj);
            }

            return qnrObj;
        }
               

        private void addValidSummary<T>()
        {
            var examNames = getPropNames<T>();

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0)
                .Select(x => new
                {
                    id = examNames.IndexOf(x.Key),
                    error = x.Value
                })
                .Where(x => x.id > 0)
                .OrderBy(x => x.id)
                .SelectMany(x => x.error.Errors.Select(e => e.ErrorMessage))
                .ToArray();


            ModelState.AddModelError("ValidSummary", string.Join(Environment.NewLine, errors));
        }

        public List<string> getPropNames<T>()
        {
            return typeof(T).GetProperties()
                            .Select(p => p.Name).ToList();
        }
               

        private async Task<Questionnaire> resetBannerImg(Questionnaire qnrObj)
        {
            string bannerPath = fileUtil.RootPath(RootPathKey.banner);
            var maxSize = manageSettings.bannerImgMaxSize;
            var unit = manageSettings.bannerImgSizeUnit;
            var extention = manageSettings.bannerImgExtention;

            Func<IFormFile, bool> acceptFile = (file) =>
            {
                var fileSize = FileUtil.fileSize(file, unit);

                return 0 < file.Length && fileSize <= maxSize
                       && FileUtil.acceptFile(file, extention);
            };

            Action deleteExist = () =>
            {
                var banner_img = qnrObj.banner_img;

                if (!string.IsNullOrEmpty(banner_img))
                {
                    DirectoryInfo root = new DirectoryInfo(bannerPath);

                    if (root.Exists && root.GetFiles(banner_img).Length > 0)
                    {
                        var existfile = root.GetFiles(banner_img)[0].FullName;

                        System.IO.File.Delete(existfile);

                        Console.WriteLine(existfile);
                    }

                    qnrObj.banner_img = null;
                    qnrObj.bannerImg_clientName = null;
                    qnrObj.bannerImg_Url = null;
                }
            };

            Func<Task> saveImg = async () =>
            {
                var clientfilename = Path.GetFileName(qnrObj.newBannerImg.FileName);
                var sysfilename = $"{Guid.NewGuid().ToString().ToUpper()}{Path.GetExtension(clientfilename)}";

                qnrObj.banner_img = sysfilename;
                qnrObj.bannerImg_clientName = clientfilename;
                qnrObj.bannerImg_Url = $"/api/showImage?filename={sysfilename}";

                var newfile = Path.Combine(bannerPath, sysfilename);

                using (var stream = System.IO.File.Create(newfile))
                {
                    await qnrObj.newBannerImg.CopyToAsync(stream);
                    qnrObj.newBannerImg = null;               
                }
            };

            if (qnrObj.newBannerImg != null)
            {
                if (acceptFile(qnrObj.newBannerImg))
                {
                    deleteExist();
                    await saveImg();
                }
            }
            else if(qnrObj.bannerImgDeleted) // 雖然前面有擋 但邏輯沒寫在一起,不連貫,看起來很痛苦
            {
                deleteExist();
            }

            qnrObj.bannerImgDeleted = false;

            return qnrObj;
        }

        [HttpGet("/api/copyQNR/{id}")]
        public object copyQNR(int id)
        {
            return qnrrepository.Copy(id);           
        }

        [HttpGet("/api/deleteQNR/{id}")]
        public object deleteQNR(int id)
        {
            bool qnrdel = this.qnrrepository.Delete(id);

            this.examRepository.Delete(id);

            return qnrdel;            
        }
    }
}
