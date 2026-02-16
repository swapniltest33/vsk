using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class InventoryService : IInventoryService
{
    private readonly ECommerceDbContext _db;

    public InventoryService(ECommerceDbContext db) => _db = db;

    public async Task<bool> AdjustStockAsync(InventoryAdjustmentRequest request, int? userId = null, CancellationToken ct = default)
    {
        var product = await _db.Products.FindAsync([request.ProductId], ct);
        if (product == null) return false;

        var newStock = product.Stock + request.QuantityChange;
        if (newStock < 0) return false;

        product.Stock = newStock;
        product.UpdatedAt = DateTime.UtcNow;

        _db.InventoryAdjustments.Add(new Domain.Entities.InventoryAdjustment
        {
            ProductId = request.ProductId,
            QuantityChange = request.QuantityChange,
            Reason = request.Reason,
            AdjustedByUserId = userId
        });

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IEnumerable<object>> GetAdjustmentHistoryAsync(int productId, CancellationToken ct = default)
    {
        return await _db.InventoryAdjustments
            .Where(ia => ia.ProductId == productId)
            .OrderByDescending(ia => ia.AdjustedAt)
            .Select(ia => new { ia.Id, ia.QuantityChange, ia.Reason, ia.AdjustedAt })
            .ToListAsync(ct);
    }
}
