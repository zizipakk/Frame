﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using FrameAuth.Data;
using FrameAuth.Services;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using AutoMapper;
using System.Reflection;
using FrameSearch.ElasticSearchProvider;
using System;
using System.Threading;
using OpenIddict.Models;
using OpenIddict.Core;
using System.Linq;
using System.Collections.Generic;
using AspNet.Security.OpenIdConnect.Primitives;
//using AspNet.Security.OpenIdConnect.Primitives;

namespace FrameAuth
{
    public class Startup
    {
        private readonly IHostingEnvironment environment;
        public IConfigurationRoot Configuration { get; }
        public static IConfigurationRoot StaticConfig { get; set; }

        public Startup(IHostingEnvironment environment)
        {            
            var builder = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
                .AddJsonFile("./Properties/launchSettings.json")
            //.AddEnvironmentVariables()
            ;

            if (environment.IsDevelopment())
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            this.environment = environment;

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            StaticConfig = Configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //TODO
            var cert = new X509Certificate2(
                Path.Combine(environment.ContentRootPath, "CARoot.pfx"),
                "PassPort",
                X509KeyStorageFlags.Exportable | X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet
            );

            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<ApplicationDbContext>(
                options =>
                {
                    options.UseSqlite(Configuration.GetConnectionString("SqLiteConnection"));
                    // Register the entity sets needed by OpenIddict.
                    // Note: use the generic overload if you need
                    // to replace the default OpenIddict entities.
                    options.UseOpenIddict();
                }      
            );                

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders(
                );

            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            //services.Configure<IdentityOptions>(options =>
            //{
            //    options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
            //    options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
            //    options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            //});

            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = "role";
            });

            // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict()
                // Register the Entity Framework stores.
                .AddEntityFrameworkCoreStores<ApplicationDbContext>()

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                .AddMvcBinders()

                // Enable the token endpoint (required to use the password flow).
                .EnableTokenEndpoint("/connect/token")
                // This is in library, and need to implicit flow
                .EnableIntrospectionEndpoint("/connect/introspect")
                .EnableAuthorizationEndpoint("/connect/authorize")
                // Close grant
                .EnableLogoutEndpoint("/connect/logoff")
                // Get profil data
                .EnableUserinfoEndpoint("/user/userinfo")

                // Allow client applications to use the grant_type=password flow.
                .AllowPasswordFlow()
                // Independent services auth
                .AllowImplicitFlow()

                // TODO
                // During development, you can disable the HTTPS requirement.
                .DisableHttpsRequirement()

                // Note: to use JWT access tokens instead of the default
                // encrypted format, the following lines are required:
                //.UseJsonWebTokens()
                // Register a new ephemeral key, that is discarded when the application
                // shuts down. Tokens signed using this key are automatically invalidated.
                // This method should only be used during development.
                //.AddEphemeralSigningKey()

                .AddSigningCertificate(cert)
                ;

            services.AddMvc();

            services.AddAutoMapper();

            //another client domain
            services.AddCors();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            services.AddTransient(typeof(IEntitySearchProvider<,,>), typeof(EntitySearchProvider<,,>));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app, 
            IHostingEnvironment env, 
            ILoggerFactory loggerFactory, 
            ApplicationDbContext dbContext,
            RoleManager<IdentityRole> roleManager,
            OpenIddictApplicationManager<OpenIddictApplication> appManager)
        {
            // TODO: Maybe obsolate
            //// .Net Core 1.1 could'nt use in same pipeline more CORS, so we change headers manual for auth server CORS
            //// So the response status codes will be right for Angular HTTP
            //app.Use(async (context, next) =>
            //{
            //    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin")
            //        && context.Request.Headers.ContainsKey("Origin"))
            //    {
            //        context.Response.Headers.Append("Access-Control-Allow-Origin", context.Request.Headers["Origin"]);
            //        context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Client, Authorization, X-Auth-Token, X-Requested-With");
            //    }

            //    //    if (context.Request.Method == "OPTIONS")
            //    //        context.Response.StatusCode = (int)HttpStatusCode.OK;

            //    await next();
            //});

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            // Add Application Insights monitoring to the request pipeline as a very first middleware.
            app.UseApplicationInsightsRequestTelemetry();

            // Add Application Insights exceptions handling to the request pipeline.
            app.UseApplicationInsightsExceptionTelemetry();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseIdentity();

            // Add external authentication middleware below. To configure them please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseCors(builder =>
                builder
                .WithOrigins(Configuration["CORS:ClientDomain"], Configuration["CORS:FrameIO"]) //client and app host path in config
                //.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseOAuthValidation();

            app.UseOpenIddict();

            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller=Home}/{action=Index}/{id?}");
            //});
            app.UseMvcWithDefaultRoute();

            using (dbContext)
            {
                dbContext.Database.EnsureCreated();

                // Seed the database with the sample applications.
                // Note: in a real world application, this step should be part of a setup script.
                InitializeAsync(CancellationToken.None, roleManager, appManager).GetAwaiter().GetResult();
            }
        }

        private async Task InitializeAsync(CancellationToken cancellationToken, RoleManager<IdentityRole> roleManager, OpenIddictApplicationManager<OpenIddictApplication> appManager)
        {            
            var roles = new List<string> { "User", "Admin" };
            roles.ToList().ForEach(async role =>
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var newRole = new IdentityRole(role);
                    await roleManager.CreateAsync(newRole);
                    // In the real world, there might be claims associated with roles
                    // _roleManager.AddClaimAsync(newRole, new )
                }
            });

            if (await appManager.FindByClientIdAsync("FrameIO", cancellationToken) == null)
            {
                var application = new OpenIddictApplication
                {
                    ClientId = "FrameIO"
                };

                await appManager.CreateAsync(application, "846B62D0-DEF9-4215-A99D-86E6B8DAB342", cancellationToken);
            }

        }
    }
}
