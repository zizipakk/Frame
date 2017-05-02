using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using FrameIO.Data;

namespace FrameIO.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170502133756_Init")]
    partial class Init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("FrameAudit.AuditLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Action");

                    b.Property<string>("CreatorId");

                    b.Property<string>("Entity");

                    b.Property<string>("EntityId");

                    b.Property<string>("Location");

                    b.Property<string>("State");

                    b.Property<DateTime>("TimeStamp");

                    b.HasKey("Id");

                    b.ToTable("AuditLogs");
                });

            modelBuilder.Entity("FrameIO.Data.ComDeviceConfig", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DeviceName");

                    b.Property<DateTime>("TimeStamp");

                    b.HasKey("Id");

                    b.ToTable("ComDeviceConfigs");
                });

            modelBuilder.Entity("FrameIO.Data.ComDeviceConfigLog", b =>
                {
                    b.Property<Guid>("LogId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DeviceName");

                    b.Property<string>("ExecutiveId");

                    b.Property<Guid>("Id");

                    b.Property<DateTime>("TimeStamp");

                    b.HasKey("LogId");

                    b.ToTable("ComDeviceConfigLogs");
                });

            modelBuilder.Entity("FrameIO.Data.ComLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Action");

                    b.Property<string>("Location");

                    b.Property<string>("Port");

                    b.Property<DateTime>("TimeStamp");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.ToTable("ComLogs");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortConfig", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("ComDeviceConfigId");

                    b.Property<Guid?>("ComPortTypeId");

                    b.Property<int>("Number");

                    b.Property<string>("PortName");

                    b.Property<DateTime>("TimeStamp");

                    b.HasKey("Id");

                    b.HasIndex("ComDeviceConfigId");

                    b.HasIndex("ComPortTypeId");

                    b.ToTable("ComPortConfigs");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortConfigLog", b =>
                {
                    b.Property<Guid>("LogId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("ComDeviceConfigId");

                    b.Property<Guid?>("ComPortTypeId");

                    b.Property<string>("ExecutiveId");

                    b.Property<Guid>("Id");

                    b.Property<int>("Number");

                    b.Property<string>("PortName");

                    b.Property<DateTime>("TimeStamp");

                    b.HasKey("LogId");

                    b.HasIndex("ComDeviceConfigId");

                    b.HasIndex("ComPortTypeId");

                    b.ToTable("ComPortConfigLogs");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AddressFormat");

                    b.Property<int>("PortType");

                    b.Property<string>("ReadProtocol");

                    b.Property<DateTime>("TimeStamp");

                    b.Property<string>("WriteProtocol");

                    b.HasKey("Id");

                    b.ToTable("ComPortTypes");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortTypeLog", b =>
                {
                    b.Property<Guid>("LogId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AddressFormat");

                    b.Property<string>("ExecutiveId");

                    b.Property<Guid>("Id");

                    b.Property<int>("PortType");

                    b.Property<string>("ReadProtocol");

                    b.Property<DateTime>("TimeStamp");

                    b.Property<string>("WriteProtocol");

                    b.HasKey("LogId");

                    b.ToTable("ComPortTypeLogs");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortConfig", b =>
                {
                    b.HasOne("FrameIO.Data.ComDeviceConfig", "ComDeviceConfig")
                        .WithMany()
                        .HasForeignKey("ComDeviceConfigId");

                    b.HasOne("FrameIO.Data.ComPortType", "ComPortType")
                        .WithMany()
                        .HasForeignKey("ComPortTypeId");
                });

            modelBuilder.Entity("FrameIO.Data.ComPortConfigLog", b =>
                {
                    b.HasOne("FrameIO.Data.ComDeviceConfig", "ComDeviceConfig")
                        .WithMany()
                        .HasForeignKey("ComDeviceConfigId");

                    b.HasOne("FrameIO.Data.ComPortType", "ComPortType")
                        .WithMany()
                        .HasForeignKey("ComPortTypeId");
                });
        }
    }
}
