namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetItems();
        T GetItem(int firstid, int secondid = 0);
        void AddElement(T item);
        void UpdateElement(T item);
        void DeleteElement(int firstid, int secondid = 0);
    }
}
