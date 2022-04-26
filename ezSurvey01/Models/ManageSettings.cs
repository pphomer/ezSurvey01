using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace survey2021.Models
{
    public class ManageSettings
    {
        public int bannerImgMaxSize { get; set; } = 500;
        public string bannerImgSizeUnit { get; set; } = "KB";
        public string bannerImgExtention { get; set; }
    }
}
