using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.RepositoryPattern;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.UnitOfWorkPattern
{
    public class UnitOfWork : IDisposable
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
        private GameEventTypeRepository _gameEventTypeRepository;
        private GameEventRepository _gameEventRepository;
        private BlockApUserRepository _blockApUserRepository;

        public UnitOfWork(AppDBContext dBContext)
        {
            this._dbcontext = dBContext;
        }

        public BlockApUserRepository BlockApUserRepository
        {
            get
            {
                if (_blockApUserRepository == null)
                    _blockApUserRepository = new BlockApUserRepository(_dbcontext);
                return _blockApUserRepository;
            }
        }

        public GameEventRepository GameEventRepository
        {
            get
            {
                if (_gameEventRepository == null)
                    _gameEventRepository = new GameEventRepository(_dbcontext);
                return _gameEventRepository;
            }
        }

        public GameEventTypeRepository GameEventTypeRepository
        {
            get
            {
                if (_gameEventTypeRepository == null)
                    _gameEventTypeRepository = new GameEventTypeRepository(_dbcontext);
                return _gameEventTypeRepository;
            }
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
        public void Dispose()
        {
            _dbcontext.Dispose();
        }
    }
}
