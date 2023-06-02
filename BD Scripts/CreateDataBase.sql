
-- „то делать со значени€ми по умолчанию? --


drop table MESSAGE;
drop table APUSERGAME;
drop table GAME;
drop table TOURNAMENTTABLE;
drop table TOURNAMENT;
drop table APUSERTEAM;
drop table TEAM;
drop table CONSTANT;
drop table NOTIFICATION;
drop table REQUEST;
drop table COMMENT;
drop table APUSER;

go

drop database footmanager

go

create database footmanager;

go

use footmanager;

go

create table APUSER
(
   pkid int,
   email nvarchar(50),
   password nvarchar(100),
   role nvarchar(50),
   firstname nvarchar(100),
   lastname nvarchar(100),
   sex nvarchar(10),
   position nvarchar(50),
   birth datetime2,
   gamesqnt nvarchar(max),
   goalsqnt nvarchar(max),
   assistsqnt nvarchar(max),
   status nvarchar(50),
   image nvarchar(max),
   
   primary key (pkid)
)

go

create table COMMENT
(
   pkid int,
   text nvarchar(max),
   date datetime2,
   fkrecipientid int,
   fksenderid int

   primary key (pkid),
   foreign key (fkrecipientid) references APUSER(pkid),
   foreign key (fksenderid)    references APUSER(pkid)
)

go

create table REQUEST
(
   pkid int,
   type nvarchar(50),
   date datetime2,
   fkrecipient int,
   fksender int,

   primary key(pkid),
   foreign key(fkrecipient) references APUSER(pkid),
   foreign key(fksender)    references APUSER(pkid)
)

go

create table NOTIFICATION
(
    pkid int,
	date datetime2,
	status nvarchar(50),
	fkrecipieint int

	primary key (pkid),
	foreign key (fkrecipieint) references APUSER(pkid) 
)

go 

create table CONSTANT
(
   pkid int,
   type  nvarchar(50),
   name  nvarchar(50),
   value int
)

go

create table TEAM
(
   pkid int,
   name nvarchar(50),
   crtdate datetime2,
   description nvarchar(max),

   primary key(pkid)
)

go

create table APUSERTEAM
(
   pkfkteamid int,
   pkfkuserid int,
   pkusertype nvarchar(50)

   primary key(pkfkteamid, pkfkuserid, pkusertype),
   foreign key(pkfkteamid) references TEAM(pkid),
   foreign key(pkfkuserid) references APUSER(pkid)
)

go

create table TOURNAMENT
(
    pkid int,
	name nvarchar(50),
	startdate datetime2,
	enddate datetime2,
	teamsqnt int,
	prizefund float,
	status nvarchar(50),
	fkcreatorid int,

	primary key(pkid),
	foreign key(fkcreatorid) references APUSER(pkid)
)

go

create table TOURNAMENTTABLE
(
   pktournamentid int,
   pkteamid int,
   gamesqnt int,
   gameswinqnt int,
   gamesdrawqnt int,
   gameslossqnt int,
   goalsscoredqnt int,
   goalsconsededqnt int,
   goalsdiff int,
   pointsqnt int,

   primary key(pktournamentid, pkteamid),
   foreign key(pktournamentid) references TOURNAMENT(pkid),
   foreign key(pkteamid)       references TEAM(pkid)
)

go

create table GAME
(
   pkid int,
   name nvarchar(50),
   adress nvarchar(100),
   datetime datetime2,
   maxplayers int,
   currplayers int,
   status nvarchar(50),
   format nvarchar(10),
   firstteamgoals int,
   secondteamgoals int,
   type nvarchar(50),
   fktournamentid int,

   primary key (pkid),
   foreign key(fktournamentid) references TOURNAMENT(pkid),
)

go

create table APUSERGAME
(
   pkfkgameid int,
   pkfkuserid int,
   pkusertype nvarchar(50),

   primary key(pkfkgameid, pkfkuserid, pkusertype),
   foreign key(pkfkgameid) references GAME(pkid),
   foreign key(pkfkuserid) references APUSER(pkid)
)

go

create table MESSAGE
(
   pkid int,
   text nvarchar(max),
   datetime datetime2,
   fkgameid int,
   fksenderid int,

   primary key(pkid),
   foreign key(fkgameid)      references  GAME(pkid),
   foreign key(fksenderid)    references  APUSER(pkid)
)


