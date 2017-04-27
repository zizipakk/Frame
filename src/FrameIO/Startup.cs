using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using AutoMapper;

namespace FrameIO
{
    public class Startup
    {
        public readonly IHostingEnvironment environment;
        public static IConfigurationRoot Configuration;

        /// <summary>
        /// Constructor for testing override
        /// </summary>
        public Startup()
        { }

        public Startup(IHostingEnvironment environment)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
                //.AddJsonFile("./Properties/launchSettings.json")
                ;
            ;

            if (environment.IsDevelopment())
            {
                //builder.AddUserSecrets(typeof(Startup).GetTypeInfo().Assembly);
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            this.environment = environment;

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);
                       
            services.AddMvcCore();

            services.AddAutoMapper();

            //another client domain
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseApplicationInsightsRequestTelemetry();

            app.UseApplicationInsightsExceptionTelemetry();

            app.UseCors(builder =>
                builder
                .WithOrigins(Configuration["CORS:ClientDomain"]) //client host path in config
                //.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseMvc();
        }
    }
}
