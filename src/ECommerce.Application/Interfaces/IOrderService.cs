using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllAsync(string? status = null, int? userId = null, CancellationToken ct = default);
    Task<OrderDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, CancellationToken ct = default);
    Task<OrderDto?> UpdateStatusAsync(int id, string status, CancellationToken ct = default);
}
