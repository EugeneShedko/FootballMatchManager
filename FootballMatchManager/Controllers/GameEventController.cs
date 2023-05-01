﻿using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/gameevent")]
    [ApiController]
    public class GameEventController : ControllerBase
    {
        private UnitOfWork _unitOfWork;

        public GameEventController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        [Route("game-events/{gameId}")]
        [HttpGet]
        public IActionResult GetGameEvents(int gameId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<GameEvent> gameEvents = _unitOfWork.GameEventRepository.GatGameEventsByGameId(gameId);

                return Ok(gameEvents);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [Route("finish-team-game")]
        [HttpPost]
        public IActionResult FinishTeamGame([FromBody] FinishTeamGameModel finishTeamGame)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                for(int i = 0; i < finishTeamGame.GameEvents.Count; i++)
                {
                    GameEventType type = _unitOfWork.GameEventTypeRepository.GetGameEventTypeByName(finishTeamGame.GameEvents[i].Type);

                    if (type == null)
                        continue;

                    GameEvent gameEvent = new GameEvent(finishTeamGame.GameId,
                                                        type.PkId, 
                                                        finishTeamGame.GameEvents[i].Time,
                                                        finishTeamGame.GameEvents[i].PlayerId,
                                                        finishTeamGame.GameEvents[i].TeamId,
                                                        finishTeamGame.GameEvents[i].EntityId1,
                                                        finishTeamGame.GameEvents[i].EntityId2);

                    _unitOfWork.GameEventRepository.AddElement(gameEvent);

                    /* Отлавливаю событие ГОЛ */
                    if(type.EventTypeId == GameEventConstnt.GOAL)
                    {
                        /* Нахожу пользователя, который забил гол и увеличиваю количество голов */
                        ApUser goalUser = _unitOfWork.ApUserRepository.GetItem(finishTeamGame.GameEvents[i].PlayerId);
                        if(goalUser == null) 
                            continue;

                        goalUser.GoalsQnt += 1;
                    }

                    /* Отлавливаю событие АССИСТ */
                    if(type.EventTypeId == GameEventConstnt.ASSIST)
                    {
                        /* Нахожу пользователя, который отдал ассист и увеличиваю количество голов */
                        ApUser goalUser = _unitOfWork.ApUserRepository.GetItem(finishTeamGame.GameEvents[i].PlayerId);
                        
                        if (goalUser == null)
                            continue;

                        goalUser.AssistsQnt += 1;
                    }
                }

                /* Получаю список участников матча */
                List<ApUser> teamGameParticipants = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticipants(finishTeamGame.GameId);

                /* Увеличиваю количество игр у участника матча */
                for (int i = 0; i < teamGameParticipants.Count; i++)
                {
                    teamGameParticipants[i].GamesQnt += 1; 
                }

                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(finishTeamGame.GameId);
                if(teamGame== null) { return BadRequest(); }

                teamGame.Status = (int)TeamGameStatus.COMPLETED;
                teamGame.FirstTeamGoals = finishTeamGame.FirstTeamGoals;
                teamGame.SecondTeamGoals = finishTeamGame.SecondTeamGoals;

                _unitOfWork.Save();

                return Ok(new { message = "Матч успешно завершен!"});
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}