using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ezSurvey01.Pages.manage
{
    public class IndexModel : PageModel
    {
        public void OnGet(string edit, string qid)
        {
            ViewData["container_extend_class"] = edit;
        }
    }
}
