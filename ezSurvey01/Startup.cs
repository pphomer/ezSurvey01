using ezSurvey01.Repository;
using ezSurvey01.Resources;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using survey2021.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Utility;

namespace ezSurvey
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string repository = Configuration.GetValue<string>("repository");

            services.AddSession();
            //services.AddMemoryCache();
            services.AddHttpContextAccessor();
            if (repository == "file")
            {
                services.AddSingleton<IQNRRepository, FileQNRRepository>();
                services.AddSingleton<IExamRepository, FileExamRepository>();
            }
            else
            {
                services.AddSingleton<IQNRRepository, SessionQNRRepository>();
                services.AddSingleton<IExamRepository, SessionExamRepository>();
            }

            services.AddSingleton<ManageSettings>(e => Configuration.GetSection("ManageSettings").Get<ManageSettings>());
            services.AddRazorPages();
            services.AddControllers();
            services.AddMvc()
                    .AddDataAnnotationsLocalization(options =>
                    {
                        options.DataAnnotationLocalizerProvider = (type, factory) =>
                            factory.Create(typeof(ValidationMessages));
                    })
                    .ConfigureApiBehaviorOptions(options =>
                    {
                        options.SuppressModelStateInvalidFilter = true; // 草稿不用檢核
                        // 停用自動400回應
                        // https://docs.microsoft.com/zh-tw/aspnet/core/web-api/?view=aspnetcore-5.0
                    });

            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
                options.LowercaseQueryStrings = true;
                options.AppendTrailingSlash = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSession();
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });

        }
    }
}
