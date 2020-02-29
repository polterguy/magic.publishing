/*
 * Magic, Copyright(c) Thomas Hansen 2019 - 2020, thomas@servergardens.com, all rights reserved.
 * See the enclosed LICENSE file for details.
 */

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using magic.library;
using magic.io.services;
using magic.io.contracts;
using magic.lambda.io.contracts;
using magic.publishing.internals;

namespace magic.backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(Configuration);
            services.AddMvc().AddNewtonsoftJson();

            /*
             * Initializing Magic.
             *
             * Notice, must be done AFTER you invoke "AddMvc".
             */
            services.AddMagicHttp();
            services.AddMagicLog4netServices();
            services.AddMagicSignals(Configuration["magic:license"]);
            services.AddMagicEndpoints(Configuration);
            services.AddMagicAuthorization(Configuration);
            services.AddMagicScheduler(Configuration);

            /*
             * Associating the IFileServices with its default implementation.
             */
            services.AddTransient<IFileService, FileService>();

            /*
             * Making sure magic.io can only be used by "root" roles.
             */
            services.AddSingleton<IAuthorize>((svc) => new AuthorizeOnlyRoles("admin", "editor", "author"));

            /*
             * Associating the root folder resolver with our own internal class,
             * that resolves the root folder for magic.io to be the config
             * setting "magic:io:root-folder", or if not given "/files".
             */
            services.AddTransient<IRootResolver, RootResolver>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /*
             * Initializing Magic.
             *
             * Notice, must be done BEFORE you invoke "UseEndpoints".
             */
            app.UseMagic(Configuration);

            app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
            app.UseAuthentication();
            app.UseRouting();
            app.UseEndpoints(conf => conf.MapControllers());
        }
    }
}
