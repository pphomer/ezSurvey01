using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using survey2021.Models;
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
    public class ValuesController : ControllerBase
    {
        private readonly IConfiguration config;

        public ValuesController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpGet]
        [Route("/api/CodeValues")]
        public object CodeValues()
        {
            var questTypes = new Dictionary<string, string>()
            {
                {"1", "單選" },
                {"2", "複選" },
                {"4", "填充" },
                {"5", "滿意度" },
            }.Select(kv => new
            {
                code = kv.Key,
                text = kv.Value
            });

            return questTypes;
        }
              

        [HttpGet("/api/manageSettings")]
        public object GetManageSettings()
        {
            var settings = this.config.GetSection("manageSettings").Get<ManageSettings>();

            //Debug.WriteLine("manageSettings", jsonHelper.toJsonString(settings));

            return settings;
        }        
    }
}
