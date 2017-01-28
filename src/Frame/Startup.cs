using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Frame.Data;
using Frame.Models;
using Frame.Services;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using System.Net;

namespace Frame
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
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();

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

                // Allow client applications to use the grant_type=password flow.
                .AllowPasswordFlow()

                // TODO
                // During development, you can disable the HTTPS requirement.
                .DisableHttpsRequirement()
                
                .UseJsonWebTokens()

                .AddSigningCertificate(cert)

                // TODO
                // Register a new ephemeral key, that is discarded when the application
                // shuts down. Tokens signed using this key are automatically invalidated.
                // This method should only be used during development.
                .AddEphemeralSigningKey()

                ;

            services.AddMvc();

            services.AddAutoMapper();

            //another client domain
            services.AddCors();

            // Add application services.

            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

        }

        private string[] roles = new[] { "User", "Admin" };
        private async Task InitializeRoles(RoleManager<IdentityRole> roleManager)
        {
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var newRole = new IdentityRole(role);
                    await roleManager.CreateAsync(newRole);
                    // In the real world, there might be claims associated with roles
                    // _roleManager.AddClaimAsync(newRole, new )
                }
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app, 
            IHostingEnvironment env, 
            ILoggerFactory loggerFactory, 
            ApplicationDbContext dbContext,
            RoleManager<IdentityRole> roleManager)
        {
            //// .Net Core 1.1 could'nt us in same pipeline more CORS, so we change headers manual for auth server CORS
            //app.Use(async (context, next) =>
            //{
            //    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin")
            //        && context.Request.Headers.ContainsKey("Origin"))
            //    {
            //        context.Response.Headers.Append("Access-Control-Allow-Origin", context.Request.Headers["Origin"]);
            //        context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Client, Authorization, X-Auth-Token, X-Requested-With");
            //    }

            //    if (context.Request.Method == "OPTIONS")
            //        context.Response.StatusCode = (int)HttpStatusCode.OK;

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
                //.WithOrigins(Configuration["CORS:ClientDomain"]) //client host path in config
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseOAuthValidation();

            app.UseOpenIddict();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            dbContext.Database.EnsureCreated();

            // Seed
            Task.Run(() => InitializeRoles(roleManager));

        }
    }
}
