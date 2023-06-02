using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FootballMatchManager.Migrations
{
    /// <inheritdoc />
    public partial class AddMessageEntityTypeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "APUSER",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    firstname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    lastname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sex = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    birth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    gamesQnt = table.Column<int>(type: "int", nullable: true),
                    goalsQnt = table.Column<int>(type: "int", nullable: true),
                    assistsQnt = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_APUSER", x => x.pkid);
                });

            migrationBuilder.CreateTable(
                name: "CONSTANT",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    group = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strvalue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    decvalue = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CONSTANT", x => x.pkid);
                });

            migrationBuilder.CreateTable(
                name: "GAME",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    adress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    datetime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    maxplayers = table.Column<int>(type: "int", nullable: true),
                    currplayers = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<int>(type: "int", nullable: false),
                    format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    type = table.Column<int>(type: "int", nullable: false),
                    fktournamentid = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GAME", x => x.pkid);
                });

            migrationBuilder.CreateTable(
                name: "GAMEEVENTTYPE",
                columns: table => new
                {
                    pkId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    eventtype = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GAMEEVENTTYPE", x => x.pkId);
                });

            migrationBuilder.CreateTable(
                name: "TEAM",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    crtDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MemberQnt = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TEAM", x => x.pkid);
                });

            migrationBuilder.CreateTable(
                name: "COMMENT",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fkrecipientid = table.Column<int>(type: "int", nullable: false),
                    fksenderid = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_COMMENT", x => x.pkid);
                    table.ForeignKey(
                        name: "FK_COMMENT_APUSER_fkrecipientid",
                        column: x => x.fkrecipientid,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_COMMENT_APUSER_fksenderid",
                        column: x => x.fksenderid,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                });

            migrationBuilder.CreateTable(
                name: "MESSAGE",
                columns: table => new
                {
                    pkid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    datetime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fksenderid = table.Column<int>(type: "int", nullable: false),
                    entityType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    entityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MESSAGE", x => x.pkid);
                    table.ForeignKey(
                        name: "FK_MESSAGE_APUSER_fksenderid",
                        column: x => x.fksenderid,
                        principalTable: "APUSER",
                        principalColumn: "pkid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NOTIFICATION",
                columns: table => new
                {
                    PkId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fkrecipientid = table.Column<int>(type: "int", nullable: false),
                    fksenderid = table.Column<int>(type: "int", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NOTIFICATION", x => x.PkId);
                    table.ForeignKey(
                        name: "FK_NOTIFICATION_APUSER_fkrecipientid",
                        column: x => x.fkrecipientid,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_NOTIFICATION_APUSER_fksenderid",
                        column: x => x.fksenderid,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                });

            migrationBuilder.CreateTable(
                name: "APUSERGAME",
                columns: table => new
                {
                    pkfkgameid = table.Column<int>(type: "int", nullable: false),
                    pkfkuserid = table.Column<int>(type: "int", nullable: false),
                    pkusertype = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_APUSERGAME", x => new { x.pkfkuserid, x.pkfkgameid, x.pkusertype });
                    table.ForeignKey(
                        name: "FK_APUSERGAME_APUSER_pkfkuserid",
                        column: x => x.pkfkuserid,
                        principalTable: "APUSER",
                        principalColumn: "pkid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_APUSERGAME_GAME_pkfkgameid",
                        column: x => x.pkfkgameid,
                        principalTable: "GAME",
                        principalColumn: "pkid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "APUSERTEAM",
                columns: table => new
                {
                    pkfkteamId = table.Column<int>(type: "int", nullable: false),
                    pkfkuserid = table.Column<int>(type: "int", nullable: false),
                    pkusertype = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_APUSERTEAM", x => new { x.pkfkteamId, x.pkfkuserid, x.pkusertype });
                    table.ForeignKey(
                        name: "FK_APUSERTEAM_APUSER_pkfkuserid",
                        column: x => x.pkfkuserid,
                        principalTable: "APUSER",
                        principalColumn: "pkid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_APUSERTEAM_TEAM_pkfkteamId",
                        column: x => x.pkfkteamId,
                        principalTable: "TEAM",
                        principalColumn: "pkid");
                });

            migrationBuilder.CreateTable(
                name: "GAMEEVENT",
                columns: table => new
                {
                    pkId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    gameId = table.Column<int>(type: "int", nullable: false),
                    gametype = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    type = table.Column<int>(type: "int", nullable: false),
                    time = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    playerId = table.Column<int>(type: "int", nullable: true),
                    teamId = table.Column<int>(type: "int", nullable: true),
                    entityId1 = table.Column<int>(type: "int", nullable: true),
                    entityId2 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GAMEEVENT", x => x.pkId);
                    table.ForeignKey(
                        name: "FK_GAMEEVENT_APUSER_entityId1",
                        column: x => x.entityId1,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_GAMEEVENT_APUSER_entityId2",
                        column: x => x.entityId2,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_GAMEEVENT_APUSER_playerId",
                        column: x => x.playerId,
                        principalTable: "APUSER",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_GAMEEVENT_GAMEEVENTTYPE_type",
                        column: x => x.type,
                        principalTable: "GAMEEVENTTYPE",
                        principalColumn: "pkId");
                    table.ForeignKey(
                        name: "FK_GAMEEVENT_TEAM_teamId",
                        column: x => x.teamId,
                        principalTable: "TEAM",
                        principalColumn: "pkid");
                });

            migrationBuilder.CreateTable(
                name: "TeamGame",
                columns: table => new
                {
                    pkId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    adress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    datetime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    firstteamgoals = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    secondteamgoals = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FkFirstTeamId = table.Column<int>(type: "int", nullable: false),
                    FkSecondTeamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamGame", x => x.pkId);
                    table.ForeignKey(
                        name: "FK_TeamGame_TEAM_FkFirstTeamId",
                        column: x => x.FkFirstTeamId,
                        principalTable: "TEAM",
                        principalColumn: "pkid");
                    table.ForeignKey(
                        name: "FK_TeamGame_TEAM_FkSecondTeamId",
                        column: x => x.FkSecondTeamId,
                        principalTable: "TEAM",
                        principalColumn: "pkid");
                });

            migrationBuilder.CreateTable(
                name: "APUSERTEAMGAME",
                columns: table => new
                {
                    PkFkTeamGameId = table.Column<int>(type: "int", nullable: false),
                    PkFkUserId = table.Column<int>(type: "int", nullable: false),
                    PkFkUserType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_APUSERTEAMGAME", x => new { x.PkFkUserId, x.PkFkTeamGameId, x.PkFkUserType });
                    table.ForeignKey(
                        name: "FK_APUSERTEAMGAME_APUSER_PkFkUserId",
                        column: x => x.PkFkUserId,
                        principalTable: "APUSER",
                        principalColumn: "pkid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_APUSERTEAMGAME_TeamGame_PkFkTeamGameId",
                        column: x => x.PkFkTeamGameId,
                        principalTable: "TeamGame",
                        principalColumn: "pkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "APUSER",
                columns: new[] { "pkid", "assistsQnt", "birth", "email", "firstname", "gamesQnt", "goalsQnt", "image", "lastname", "password", "position", "role", "sex", "status" },
                values: new object[,]
                {
                    { 1, null, null, "system", "default", null, null, null, null, "password", null, "system", null, null },
                    { 2, null, null, "admin@mail.ru", null, null, null, null, null, "nEKhNG4zOncJBLKis3+n0w==", null, "system", null, null }
                });

            migrationBuilder.InsertData(
                table: "CONSTANT",
                columns: new[] { "pkid", "decvalue", "group", "name", "strvalue", "type" },
                values: new object[,]
                {
                    { 1, null, "notification", "addtogame", "Пользователь {user} присоединлся к матчу {game}", "text" },
                    { 2, null, "notification", "leavefromgame", "Пользователь {user} покинул матч {game}", "text" },
                    { 3, null, "notification", "requestforgame", "Пользователь {user} отправил запрос на участие в матче {game}. Разрешить?", "requestforgame" },
                    { 4, null, "notification", "dismissreqgame", "Пользователь {user} отклонил ваш запрос на участие в матче {game}", "text" },
                    { 5, null, "notification", "acceptreqgame", "Пользователь {user} принял ваш запрос на участие в матче {game}", "text" },
                    { 6, null, "notification", "requestforteam", "Пользователь {user} отправил запрос на присоединение к команде {team}. Разршеить?", "requestforteam" },
                    { 7, null, "notification", "acceptregteam", "Пользователь {user} принял ваш запрос на присоединение к команде {team}", "text" },
                    { 8, null, "notification", "dismissregteam", "Пользователь {user} отклонил ваш запрос на присоединение к команде {team}", "text" },
                    { 9, null, "notification", "errorreqteam", "Невозможно отпарвить запрос на присоединение к команде, так как вы уже являетесь участником 3 команд", "text" },
                    { 10, null, "notification", "teamreqsend", "Ваш запрос на присоединение к команде {team} отправлен", "text" },
                    { 11, null, "notification", "requestforteamgame", "{team} отправила запрос на присоединение к командному матчу {name}", "requestforteamgame" },
                    { 12, null, "notification", "teamgamereqsend", "Ваш запрос на присоединение к матчу отправлен", "text" },
                    { 13, null, "notification", "dismissreqteamgame", "Команда {team} отклонила ваш запрос на участие в матче {game}", "text" },
                    { 14, null, "notification", "acceptreqteamgame", "Команда {user} принял ваш запрос на участие в матче {game}", "text" },
                    { 15, null, "notification", "leaveteamgame", "Команда {team} покинула матч {game}", "text" },
                    { 16, null, "notification", "errorinviteteam", "Невозможно отправить приглашение на присоединение к команде, так как вы не являетесь организатором команды", "text" },
                    { 17, null, "notification", "requstforinviteteam", "Пользователь {user} приглашает вас присоединиться к команде {team}.", "requstforinviteteam" },
                    { 18, null, "notification", "teaminvitesend", "Ваше приглашение успешно отправлено!", "text" },
                    { 19, null, "notification", "dismissinviteteam", "Пользователь {user} отклонил ваше приглашение на присоединение к команде {team}.", "text" },
                    { 20, null, "notification", "acceptinviteteam", "Пользователь {user} принял ваше приглашение на присоединение к команде {team}.", "text" },
                    { 21, null, "notification", "acceptinviteteamsend", "Вы присоединились к команде {team}!", "text" },
                    { 22, null, "notification", "requesttoinvitegame", "Пользователь {user} приглашает вас принять участие в игре {game}", "requesttoinvitegame" },
                    { 23, null, "notification", "dismissinvitegame", "Пользователь {user} отклонил ваше приглашение на присоединение к матчу {game}.", "text" },
                    { 24, null, "notification", "acceptinvitegame", "Пользователь {user} принял ваше приглашение на присоединение к матчу {game}.", "text" },
                    { 25, null, "notification", "acceptinvitegamesend", "Вы присоединились к матчу {game}!", "text" },
                    { 26, null, "position", "forward", "Нападающий", "text" },
                    { 27, null, "position", "left midfielder", "Левый полузащитник", "text" },
                    { 28, null, "position", "right midfielder", "Правый полузащитник", "text" },
                    { 29, null, "position", "attacking midfielder", "Атакующий полузащитник", "text" },
                    { 30, null, "position", "central midfielder", "Центральный полузащитник", "text" },
                    { 31, null, "position", "holding midfielder", "Опорный полузащитник", "text" },
                    { 32, null, "position", "left defender", "Левый защитник", "text" },
                    { 33, null, "position", "right defender", "Правый защитник", "text" },
                    { 34, null, "position", "central defender", "Центральный защитник", "text" },
                    { 35, null, "position", "Goalkeeper", "Вратарь", "text" },
                    { 36, null, "notification", "requesttoinviteteamgame", "Команда {team} приглашает вашу команду принять участие в командном матче {game}", "requesttoinviteteamgame" },
                    { 37, null, "notification", "dismissinviteteamgame", "Команда {team} отклонил ваше приглашение на присоединение к командному матчу {game}.", "text" },
                    { 38, null, "notification", "acceptinviteteamgame", "Команда {team} приняла ваше приглашение на присоединение к командному матчу {game}.", "text" },
                    { 39, null, "notification", "acceptinviteteamgamesend", "Ваша команда присоединилась к матчу {game}!", "text" }
                });

            migrationBuilder.InsertData(
                table: "GAMEEVENTTYPE",
                columns: new[] { "pkId", "eventtype", "image", "text" },
                values: new object[,]
                {
                    { 1, "goal", "default/event-goal.png", "Гол!" },
                    { 2, "yellowcard", "default/event-card.png", "Желтая карточка!" },
                    { 3, "redcard", "default/event-card.png", "Красная карточка!" },
                    { 4, "change", "default/event-change.png", "Замена!" },
                    { 5, "penalty", "default/event-penalty.png", "Пенальти!" },
                    { 6, "freekick", "default/event-free-kick2.png", "Штрафной удар!" },
                    { 7, "corner", "default/event-corner.png", "Углавой удар!" },
                    { 8, "assist", "default/event-assist.png", "Голевой пас!" }
                });

            migrationBuilder.InsertData(
                table: "TEAM",
                columns: new[] { "pkid", "crtDate", "description", "Image", "MemberQnt", "name" },
                values: new object[] { 1, new DateTime(2023, 5, 9, 15, 20, 48, 653, DateTimeKind.Local).AddTicks(9795), null, "default/question.png", 0, "" });

            migrationBuilder.CreateIndex(
                name: "IX_APUSERGAME_pkfkgameid",
                table: "APUSERGAME",
                column: "pkfkgameid");

            migrationBuilder.CreateIndex(
                name: "IX_APUSERTEAM_pkfkuserid",
                table: "APUSERTEAM",
                column: "pkfkuserid");

            migrationBuilder.CreateIndex(
                name: "IX_APUSERTEAMGAME_PkFkTeamGameId",
                table: "APUSERTEAMGAME",
                column: "PkFkTeamGameId");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENT_fkrecipientid",
                table: "COMMENT",
                column: "fkrecipientid");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENT_fksenderid",
                table: "COMMENT",
                column: "fksenderid");

            migrationBuilder.CreateIndex(
                name: "IX_GAMEEVENT_entityId1",
                table: "GAMEEVENT",
                column: "entityId1");

            migrationBuilder.CreateIndex(
                name: "IX_GAMEEVENT_entityId2",
                table: "GAMEEVENT",
                column: "entityId2");

            migrationBuilder.CreateIndex(
                name: "IX_GAMEEVENT_playerId",
                table: "GAMEEVENT",
                column: "playerId");

            migrationBuilder.CreateIndex(
                name: "IX_GAMEEVENT_teamId",
                table: "GAMEEVENT",
                column: "teamId");

            migrationBuilder.CreateIndex(
                name: "IX_GAMEEVENT_type",
                table: "GAMEEVENT",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "IX_MESSAGE_fksenderid",
                table: "MESSAGE",
                column: "fksenderid");

            migrationBuilder.CreateIndex(
                name: "IX_NOTIFICATION_fkrecipientid",
                table: "NOTIFICATION",
                column: "fkrecipientid");

            migrationBuilder.CreateIndex(
                name: "IX_NOTIFICATION_fksenderid",
                table: "NOTIFICATION",
                column: "fksenderid");

            migrationBuilder.CreateIndex(
                name: "IX_TeamGame_FkFirstTeamId",
                table: "TeamGame",
                column: "FkFirstTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamGame_FkSecondTeamId",
                table: "TeamGame",
                column: "FkSecondTeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "APUSERGAME");

            migrationBuilder.DropTable(
                name: "APUSERTEAM");

            migrationBuilder.DropTable(
                name: "APUSERTEAMGAME");

            migrationBuilder.DropTable(
                name: "COMMENT");

            migrationBuilder.DropTable(
                name: "CONSTANT");

            migrationBuilder.DropTable(
                name: "GAMEEVENT");

            migrationBuilder.DropTable(
                name: "MESSAGE");

            migrationBuilder.DropTable(
                name: "NOTIFICATION");

            migrationBuilder.DropTable(
                name: "GAME");

            migrationBuilder.DropTable(
                name: "TeamGame");

            migrationBuilder.DropTable(
                name: "GAMEEVENTTYPE");

            migrationBuilder.DropTable(
                name: "APUSER");

            migrationBuilder.DropTable(
                name: "TEAM");
        }
    }
}
