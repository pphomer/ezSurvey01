using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Utility;

namespace ezSurvey01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileAPIController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly FileUtil fileUtil;

        // GET: api/<FileAPIController>
        public FileAPIController(IConfiguration config)
        {
            this.config = config;
            this.fileUtil = new FileUtil(this.config);
        }

        // POST api/<FileAPIController>
        [HttpPost]
        [Route("/api/uploadFile")]
        public async Task<object> Post([FromForm] UPloadFile fileObj)
        {
            var fileName = await fileUtil.Save(fileObj.file, RootPathKey.mceImage);

            var obj = new
            {
                location = $"/api/showImage?mce=y&filename={fileName}"
            };

            // return  jsonHelper.toJsonString(obj);
            return ValidationProblem("貼圖請改用圖片網址...");
        }

        // PUT api/<FileAPIController>/5
        [HttpGet]
        [Route("/api/showImage")]
        public IActionResult Get(string mce, string filename)
        {
            if (filename == null)
            {
                return null;
            }

            Console.Write(filename);

            var rootPath = mce == null
                         ? fileUtil.RootPath(RootPathKey.banner)
                         : fileUtil.RootPath(RootPathKey.mceImage);

            var filefullName = Path.Combine(rootPath, filename);

            FileInfo file = new FileInfo(filefullName);

            return PhysicalFile(file.FullName, "image/jpeg");
        }

        

        public class UPloadFile
        {
            public IFormFile file { get; set; }
        }

    }

    public class RootPathKey
    {        
        public const string UploadRoot = "UploadRoot";
        public const string mceImage = "mceImage";
        public const string banner = "banner";
    }

    public class FileUtil
    {
        private readonly IConfiguration config;
        private static readonly Lazy<FileExtensionContentTypeProvider> contentTypeProvider = new Lazy<FileExtensionContentTypeProvider>();
        public FileUtil(IConfiguration config)
        {
            this.config = config;
        }

        public string RootPath(string rootpathkey)
        {
            return config.GetSection(RootPathKey.UploadRoot).GetValue<string>(rootpathkey);
        }
        
        public static long fileSize(IFormFile file, string unit)
        {
            long size = 0;

            if (file.Length > 0)
            {
                double baseKB = 1024;
                double baseUnit = unit == "MB" ? Math.Pow(baseKB, 2) : baseKB;
                size = Convert.ToInt32(Math.Floor(file.Length * 10 / baseUnit) / 10);
            }

            return size;
        }

        public async Task<string> Save(IFormFile file, string RootPathKey, string customPath = "")
        {
            Func<string> getfileName = () => $"{Guid.NewGuid().ToString().ToUpper()}{Path.GetExtension(file.FileName).ToLower()}";

            Func<string, string> fullName = (fileName) =>
            {
                var rootPath = RootPath(RootPathKey);

                DirectoryInfo info = new DirectoryInfo(rootPath);

                if (!string.IsNullOrEmpty(customPath)
                   && info.GetDirectories(customPath, SearchOption.TopDirectoryOnly).Length == 0)
                {
                    info.CreateSubdirectory(customPath);
                }

                return Path.Combine(rootPath, customPath, fileName);
            };

            if (file?.Length > 0 && normalFile(file))
            {
                var fileName = getfileName();

                using (var stream = System.IO.File.Create(fullName(fileName)))
                {
                    await file.CopyToAsync(stream);
                }

                return fileName;
            }

            return "";
        }

        public static string[] normalExtensions() => ".gif, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .ppt, .pptx, .doc, .docx".Split(',').Select(s => s.Trim()).ToArray();

        public bool normalFile(IFormFile file) => acceptFile(file, normalExtensions());

        public static bool acceptFile(IFormFile file, string matchExtensions)
        {
            var extensions = matchExtensions.Split(",", StringSplitOptions.RemoveEmptyEntries)
                 .Select(e => e.Trim()).ToArray();

            return acceptFile(file, extensions);
        }

        public static bool acceptFile(IFormFile file, string[] matchExtensions)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();

            var matchExtension = matchExtensions.Where(ext => ext.ToLower() == extension
                                              && contentTypeProvider.Value.Mappings.TryGetValue(extension, out var ct)
                                              && ct == file.ContentType)
                                 .FirstOrDefault();

            return matchExtension != null;
        }        
    }
}
