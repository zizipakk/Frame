using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using FrameLog.Data;

namespace FrameLog.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170206153741_Init")]
    partial class Init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752");

            modelBuilder.Entity("FrameLog.Data.Log", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Location");

                    b.Property<string>("Message");

                    b.Property<string>("Stack");

                    b.Property<DateTime>("TimeStamp");

                    b.Property<string>("Type");

                    b.Property<Guid?>("UserId");

                    b.HasKey("Id");

                    b.ToTable("Logs");
                });
        }
    }
}
