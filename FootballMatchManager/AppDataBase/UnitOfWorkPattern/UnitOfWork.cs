using FootballMatchManager.AppDataBase.RepositoryPattern;
using FootballMatchManager.DataBase.DBClasses;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.UnitOfWorkPattern
{
    public class UnitOfWork
    {
        private AppDBContext _dbcontext;
        private ApUserGameRepository _apUserGameRepository;
        private ApUserRepository _apUserRepository;
        private ApUserTeamRepository _apUserTeamRepository;
        private CommentRepository _commentRepository;
        private ConstantRepository _constantRepository;
        private GameRepository _gameRepository;
        private MessageRepository _messageRepository;
        private NotificationRepository _notificationRepository;
        private TeamRepository _teamRepository;
        private TeamGameRepasitory _teamGameRepasitory;
        private ApUserTeamGameRepasitory _apUserTeamGameRepasitory;

        public UnitOfWork(AppDBContext dBContext)
        {
            this._dbcontext = dBContext;
        }

        public TeamGameRepasitory TeamGameRepasitory
        {
            get 
            {
                if (_teamGameRepasitory == null)
                    _teamGameRepasitory = new TeamGameRepasitory(_dbcontext);
                return _teamGameRepasitory;
            }
        }

        public ApUserTeamGameRepasitory ApUserTeamGameRepasitory
        {
            get 
            {
                if (_apUserTeamGameRepasitory == null)
                    _apUserTeamGameRepasitory = new ApUserTeamGameRepasitory(_dbcontext);
                return _apUserTeamGameRepasitory;
            }
        }

        public ApUserGameRepository ApUserGameRepository
        {
            get
            {
                if (_apUserGameRepository == null)
                    _apUserGameRepository = new ApUserGameRepository(_dbcontext);
                return _apUserGameRepository;
            }
        }

        public ApUserRepository ApUserRepository
        {
            get
            {
                if (_apUserRepository == null)
                    _apUserRepository = new ApUserRepository(_dbcontext);
                return _apUserRepository;
            }
        }

        public ApUserTeamRepository ApUserTeamRepository
        {
            get
            {
                if (_apUserTeamRepository == null)
                    _apUserTeamRepository = new ApUserTeamRepository(_dbcontext);
                return _apUserTeamRepository;

            }
        }

        public CommentRepository CommentRepository
        {
            get
            {
                if (_commentRepository == null)
                    _commentRepository = new CommentRepository(_dbcontext);
                return _commentRepository;
            }
        }
        public ConstantRepository ConstantRepository
        {
            get
            {
                if (_constantRepository == null)
                    _constantRepository = new ConstantRepository(_dbcontext);
                return _constantRepository;
            }
        }
        public GameRepository GameRepository
        {
            get
            {
                if (_gameRepository == null)
                    _gameRepository = new GameRepository(_dbcontext);
                return _gameRepository;
            }
        }
        public MessageRepository MessageRepository
        {
            get 
            {
                if(_messageRepository == null)
                    _messageRepository = new MessageRepository(_dbcontext);
                return _messageRepository;
            }
        }
        public NotificationRepository NotificationRepository
        {
            get 
            {
                if (_notificationRepository == null)
                    _notificationRepository= new NotificationRepository(_dbcontext);
                return _notificationRepository;
            }
        }

        public TeamRepository TeamRepository
        {
            get 
            {
                if(_teamRepository == null)
                    _teamRepository= new TeamRepository(_dbcontext);
                return _teamRepository;            }
        }

        public void Save()
        {
            _dbcontext.SaveChanges();
        }
    }
}
