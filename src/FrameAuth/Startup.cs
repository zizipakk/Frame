﻿using AspNet.Security.OAuth.Validation;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using FrameAuth.Controllers;
using FrameAuth.Data;
using FrameAuth.Services;
using FrameSearch.Controllers;
using FrameSearch.ElasticSearchProvider;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenIddict;
using OpenIddict.Core;
using OpenIddict.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
//using AspNet.Security.OpenIdConnect.Primitives;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Localization;

namespace FrameAuth
{
    public class Startup
    {
        private readonly IHostingEnvironment environment;
        public static IHostingEnvironment StaticEnvironment;
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
            StaticEnvironment = environment;

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            StaticConfig = Configuration;
        }

        private static X509Certificate2 GetCert()
        {
            return new X509Certificate2(
                Path.Combine(StaticEnvironment.ContentRootPath, "CARoot.pfx"),
                "PassPort",
                X509KeyStorageFlags.Exportable | X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet
            );
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<ApplicationDbContext>(
                options =>
                {
                    // options.UseInMemoryDatabase();
                    options.UseSqlite(Configuration.GetConnectionString("SqLiteConnection"));
                    // Register the entity sets needed by OpenIddict.
                    // Note: use the generic overload if you need
                    // to replace the default OpenIddict entities.
                    options.UseOpenIddict();
                }      
            );                

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext, string>() // TODO: Type of Id necessary?
                .AddDefaultTokenProviders()
                ;

            //services.AddAuthentication();

            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
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

                // Allow client applications to use the grant_type=password flow. ...
                .AllowPasswordFlow()

                // Independent services retrospect auth
                .AllowImplicitFlow()

                // TODO
                // During development, you can disable the HTTPS requirement.
                .DisableHttpsRequirement()


                // Register a new ephemeral key, that is discarded when the application
                // shuts down. Tokens signed using this key are automatically invalidated.
                // This method should only be used during development.
                .AddEphemeralSigningKey();

                //.AddSigningCertificate(GetCert());

            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services
                .AddMvc()
                //.AddApplicationPart(typeof(EntitySearchController<,,>).GetTypeInfo().Assembly)
                //.AddControllersAsServices();
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();
            ;

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
            UserManager<ApplicationUser> userManager,
            OpenIddictApplicationManager<OpenIddictApplication> appManager)
        {
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

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en-US")
                //// Formatting numbers, dates, etc.
                //SupportedCultures = supportedCultures,
                //// UI strings that we have localized.
                //SupportedUICultures = supportedCultures
            });

            app.UseStaticFiles();

            app.UseWhen(
                context => 
                    (context.Request.Path.StartsWithSegments("/home")
                    || context.Request.Path.StartsWithSegments("/account")
                    || context.Request.Path.StartsWithSegments("/manage"))
                ,branch =>
                    {
                        branch.UseIdentity();
                        // Add external authentication middleware below. To configure them please see http://go.microsoft.com/fwlink/?LinkID=532715
                    });

            app.UseWhen(
                context =>
                    !(context.Request.Path.StartsWithSegments("/home")
                    || context.Request.Path.StartsWithSegments("/account")
                    || context.Request.Path.StartsWithSegments("/manage"))
                ,branch =>
                    {
                        branch.UseOAuthValidation();
                    });

            app.UseCors(builder =>
                builder
                .WithOrigins(Configuration["server.urls"], Configuration["CORS:ClientDomain"], Configuration["CORS:FrameIO"]) //self redirection, client and app host path in config
                //.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseOpenIddict();

            app.UseMvcWithDefaultRoute();

            using (dbContext)
            {
                dbContext.Database.EnsureCreated();

                // Seed the database with the sample applications.
                // Note: in a real world application, this step should be part of a setup script.
                InitializeAsync(CancellationToken.None, roleManager, userManager, appManager).GetAwaiter().GetResult();
            }
        }

        private async Task InitializeAsync(
            CancellationToken cancellationToken, 
            RoleManager<IdentityRole> roleManager, 
            UserManager<ApplicationUser> userManager, 
            OpenIddictApplicationManager<OpenIddictApplication> appManager)
        {   
            if (await userManager.FindByNameAsync("_Admin123@a") == null)
            {
                var user = new ApplicationUser
                {
                    Email = "_Admin123@a",
                    IsAdmin = true,
                    UserName = "_Admin123@a"
                };
                var userResult = await userManager.CreateAsync(user, "_Admin123");

                var roles = new List<string> { "User", "Admin" };
                roles.ToList().ForEach(role =>
                {
                    if (!roleManager.RoleExistsAsync(role).GetAwaiter().GetResult())
                    {
                        var newRole = new IdentityRole(role);
                        var roleResult = roleManager.CreateAsync(newRole).GetAwaiter().GetResult();
                        // In the real world, there might be claims associated with roles
                        // roleManager.AddClaimAsync(newRole, new ).GetAwaiter().GetResult()

                        if (userResult.Succeeded && roleResult.Succeeded)
                            userManager.AddToRoleAsync(user, role).GetAwaiter().GetResult(); //finally add user to roles
                    }
                });                
            }

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
