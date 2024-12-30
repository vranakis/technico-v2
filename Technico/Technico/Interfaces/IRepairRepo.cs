using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Models;

namespace Technico.Interfaces;

public interface IRepairRepo
{
    public Task<List<Repair>?> GetAllActiveTodayAsync(int pageCount, int pageSize);
    public Task<List<Repair>?> GetAllByUserGuidAsync(Guid userId);
}
