using Technico.Models;

namespace Technico.Repositories;

public interface IRepository<T, K> where T : class
{
    public Task<T?> CreateAsync(T t);
    public Task<T?> UpdateAsync(Guid id, T t);
    public Task<T?> DeleteAsync(Guid id);
    public Task<T?> GetAsync(Guid id);
    public Task<List<T>?> GetAllAsync(int pageCount, int pageSize);
    public Task<List<T>?> GetAllByGuidAsync(Guid id);
    Task DeleteRangeAsync(List<T> t);
}
