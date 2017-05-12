using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using FrameIO.Data;
using FrameIO.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using Microsoft.Extensions.Caching.Distributed;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FrameIO
{
    public class Startup
    {
        public readonly IHostingEnvironment environment;
        public static IConfigurationRoot Configuration;

        public Startup(IHostingEnvironment environment)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
                .AddJsonFile("./Properties/launchSettings.json")
                ;

            if (environment.IsDevelopment())
            {
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

            services.AddDbContext<ApplicationDbContext>(
                options => options.UseSqlite(Configuration.GetConnectionString("SqLiteConnection"))
            );

            services.AddAuthentication();
            services.AddDistributedMemoryCache(); //need introspect

            services.AddMvcCore();
            services.AddAutoMapper();
            services.AddCors();
            services.AddSingleton<IComPortService, ComPortService>();
            services.AddTransient<IComConfigService, ComConfigService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory,
            ApplicationDbContext dbContext)
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

            //TODO: get a trip to the auth service, so setup identity
            app.UseOAuthIntrospection(options =>
            {
                options.Authority = new Uri(Configuration["AuthServer"]);
                options.Audiences.Add("FrameIO");
                options.ClientId = "FrameIO";
                options.ClientSecret = "846B62D0-DEF9-4215-A99D-86E6B8DAB342";
                options.RequireHttpsMetadata = false;
                options.AutomaticAuthenticate = true;
                options.AutomaticChallenge = true;

                // Note: you can override the default name and role claims:
                // options.NameClaimType = "custom_name_claim";
                // options.RoleClaimType = "custom_role_claim";
            });

            app.UseMvcWithDefaultRoute();

            app.UseMvc();

            using (dbContext)
            {
                dbContext.Database.EnsureCreated();
                InitializeAsync(dbContext).GetAwaiter().GetResult();
            }
        }

        private async Task InitializeAsync(ApplicationDbContext dbContext)
        {
            if (!await dbContext.ComPortTypes.AnyAsync())
            {
                await dbContext.ComPortTypes.AddRangeAsync(
                    new List<ComPortType>
                    {
                        new ComPortType
                        {                        
                            PortType = PortType.DigitalOutput,
                            AddressFormat = "",
                            ReadProtocol = "",
                            WriteProtocol = ""                        
                        },
                        new ComPortType
                        {
                            PortType = PortType.DigitalInput,
                            AddressFormat = "",
                            ReadProtocol = "",
                            WriteProtocol = ""
                        },
                        new ComPortType
                        {
                            PortType = PortType.AnalogeInput,
                            AddressFormat = "",
                            ReadProtocol = "",
                            WriteProtocol = ""
                        }
                    });
                await dbContext.SaveChangesAsync();
            }       
        }
    }
}
