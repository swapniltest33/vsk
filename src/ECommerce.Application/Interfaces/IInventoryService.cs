using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IInventoryService
{
    Task<bool> AdjustStockAsync(InventoryAdjustmentRequest request, int? userId = null, CancellationToken ct = default);
    Task<IEnumerable<object>> GetAdjustmentHistoryAsync(int productId, CancellationToken ct = default);
}
