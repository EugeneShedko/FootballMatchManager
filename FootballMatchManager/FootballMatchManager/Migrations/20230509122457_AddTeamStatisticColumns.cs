using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballMatchManager.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamStatisticColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConsededGoalsQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DrawsQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GamesQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LosesQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScoredGoalsQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WinsQnt",
                table: "TEAM",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "TEAM",
                keyColumn: "pkid",
                keyValue: 1,
                columns: new[] { "ConsededGoalsQnt", "crtDate", "DrawsQnt", "GamesQnt", "LosesQnt", "ScoredGoalsQnt", "WinsQnt" },
                values: new object[] { 0, new DateTime(2023, 5, 9, 15, 24, 57, 151, DateTimeKind.Local).AddTicks(1493), 0, 0, 0, 0, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsededGoalsQnt",
                table: "TEAM");

            migrationBuilder.DropColumn(
                name: "DrawsQnt",
                table: "TEAM");

            migrationBuilder.DropColumn(
                name: "GamesQnt",
                table: "TEAM");

            migrationBuilder.DropColumn(
                name: "LosesQnt",
                table: "TEAM");

            migrationBuilder.DropColumn(
                name: "ScoredGoalsQnt",
                table: "TEAM");

            migrationBuilder.DropColumn(
                name: "WinsQnt",
                table: "TEAM");

            migrationBuilder.UpdateData(
                table: "TEAM",
                keyColumn: "pkid",
                keyValue: 1,
                column: "crtDate",
                value: new DateTime(2023, 5, 9, 15, 20, 48, 653, DateTimeKind.Local).AddTicks(9795));
        }
    }
}
