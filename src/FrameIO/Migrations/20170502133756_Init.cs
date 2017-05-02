using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FrameIO.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Action = table.Column<string>(nullable: true),
                    CreatorId = table.Column<string>(nullable: true),
                    Entity = table.Column<string>(nullable: true),
                    EntityId = table.Column<string>(nullable: true),
                    Location = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComDeviceConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DeviceName = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComDeviceConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComDeviceConfigLogs",
                columns: table => new
                {
                    LogId = table.Column<Guid>(nullable: false),
                    DeviceName = table.Column<string>(nullable: true),
                    ExecutiveId = table.Column<string>(nullable: true),
                    Id = table.Column<Guid>(nullable: false),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComDeviceConfigLogs", x => x.LogId);
                });

            migrationBuilder.CreateTable(
                name: "ComLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Action = table.Column<string>(nullable: true),
                    Location = table.Column<string>(nullable: true),
                    Port = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComPortTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AddressFormat = table.Column<string>(nullable: true),
                    PortType = table.Column<int>(nullable: false),
                    ReadProtocol = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false),
                    WriteProtocol = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComPortTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComPortTypeLogs",
                columns: table => new
                {
                    LogId = table.Column<Guid>(nullable: false),
                    AddressFormat = table.Column<string>(nullable: true),
                    ExecutiveId = table.Column<string>(nullable: true),
                    Id = table.Column<Guid>(nullable: false),
                    PortType = table.Column<int>(nullable: false),
                    ReadProtocol = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false),
                    WriteProtocol = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComPortTypeLogs", x => x.LogId);
                });

            migrationBuilder.CreateTable(
                name: "ComPortConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ComDeviceConfigId = table.Column<Guid>(nullable: true),
                    ComPortTypeId = table.Column<Guid>(nullable: true),
                    Number = table.Column<int>(nullable: false),
                    PortName = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComPortConfigs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComPortConfigs_ComDeviceConfigs_ComDeviceConfigId",
                        column: x => x.ComDeviceConfigId,
                        principalTable: "ComDeviceConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ComPortConfigs_ComPortTypes_ComPortTypeId",
                        column: x => x.ComPortTypeId,
                        principalTable: "ComPortTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ComPortConfigLogs",
                columns: table => new
                {
                    LogId = table.Column<Guid>(nullable: false),
                    ComDeviceConfigId = table.Column<Guid>(nullable: true),
                    ComPortTypeId = table.Column<Guid>(nullable: true),
                    ExecutiveId = table.Column<string>(nullable: true),
                    Id = table.Column<Guid>(nullable: false),
                    Number = table.Column<int>(nullable: false),
                    PortName = table.Column<string>(nullable: true),
                    TimeStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComPortConfigLogs", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_ComPortConfigLogs_ComDeviceConfigs_ComDeviceConfigId",
                        column: x => x.ComDeviceConfigId,
                        principalTable: "ComDeviceConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ComPortConfigLogs_ComPortTypes_ComPortTypeId",
                        column: x => x.ComPortTypeId,
                        principalTable: "ComPortTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComPortConfigs_ComDeviceConfigId",
                table: "ComPortConfigs",
                column: "ComDeviceConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_ComPortConfigs_ComPortTypeId",
                table: "ComPortConfigs",
                column: "ComPortTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ComPortConfigLogs_ComDeviceConfigId",
                table: "ComPortConfigLogs",
                column: "ComDeviceConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_ComPortConfigLogs_ComPortTypeId",
                table: "ComPortConfigLogs",
                column: "ComPortTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "ComDeviceConfigLogs");

            migrationBuilder.DropTable(
                name: "ComLogs");

            migrationBuilder.DropTable(
                name: "ComPortConfigs");

            migrationBuilder.DropTable(
                name: "ComPortConfigLogs");

            migrationBuilder.DropTable(
                name: "ComPortTypeLogs");

            migrationBuilder.DropTable(
                name: "ComDeviceConfigs");

            migrationBuilder.DropTable(
                name: "ComPortTypes");
        }
    }
}
