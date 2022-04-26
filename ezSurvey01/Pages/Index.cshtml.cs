using ezSurvey01.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezSurvey01.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IQNRRepository qnrrepository;

        public IndexModel(ILogger<IndexModel> logger, IQNRRepository qnrrepository)
        {
            _logger = logger;
            this.qnrrepository = qnrrepository;
        }

        public string UserName { get => User.Identity.Name; }

        public void OnGet()
        {
            
        }
    }
}
