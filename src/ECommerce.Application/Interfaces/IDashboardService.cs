using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStats> GetStatsAsync(CancellationToken ct = default);
}
