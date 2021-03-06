﻿using FrameIO;
using FrameIO.Configurations;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;

namespace FrameTests
{
    public class FrameIOTestFixtures
    {
        public class FrameIOFixture : IDisposable
        {
            public readonly string c_SourcePort;
            public readonly string c_DestPort;
            public readonly int c_TimeOut = 300;
            private readonly TestServer server;
            private readonly HttpClient client;

            public FrameIOFixture()
            {
                var builder = new WebHostBuilder().UseStartup<TestStartup>();
                server = new TestServer(builder);
                client = server.CreateClient();

                c_SourcePort = ComConfiguration.SourcePort;
                c_DestPort = ComConfiguration.DestPort;
            }

            public void Dispose()
            {
                server.Dispose();
                client.Dispose();
            }
        }

        /// <summary>
        /// Override startup class for test config
        /// </summary>
        public class TestStartup : Startup
        {
            public TestStartup(IHostingEnvironment environment) : base(environment)
            {
                //var builder = new ConfigurationBuilder()
                //    .SetBasePath(environment.ContentRootPath)
                //    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                //    .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
                //    .AddEnvironmentVariables();
                //Configuration = builder.Build();
            }

            //public void ConfigureTestServices(IServiceCollection services)
            //{
            //    services.Replace<IService, MockedService>();
            //    services.AddEntityFrameworkSqlite()
            //        .AddDbContext<ApplicationDbContext>(
            //            options => options.UseSqlite(connection)
            //        );
            //}

            //public void Configure(IApplicationBuilder app)
            //{
            //    your usual registrations there
            //}
        }

        



    }
}
