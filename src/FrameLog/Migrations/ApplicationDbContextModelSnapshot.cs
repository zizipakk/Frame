using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using FrameLog.Data;

namespace FrameLog.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

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
