using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly ECommerceDbContext _db;

    public DashboardService(ECommerceDbContext db) => _db = db;

    public async Task<DashboardStats> GetStatsAsync(CancellationToken ct = default)
    {
        var totalSales = await _db.OrderItems.SumAsync(oi => oi.Price * oi.Quantity, ct);
        var totalOrders = await _db.Orders.CountAsync(ct);
        var totalProducts = await _db.Products.CountAsync(ct);
        var lowStockCount = await _db.Products.CountAsync(p => p.Stock < 10, ct);

        var vendorRevenues = await _db.OrderItems
            .Include(oi => oi.Product).ThenInclude(p => p.Vendor)
            .GroupBy(oi => new { oi.Product.VendorId, oi.Product.Vendor!.Name })
            .Select(g => new { g.Key.VendorId, g.Key.Name, Revenue = g.Sum(oi => oi.Price * oi.Quantity) })
            .OrderByDescending(x => x.Revenue)
            .Take(10)
            .ToListAsync(ct);

        var productCounts = await _db.Vendors
            .Where(v => vendorRevenues.Select(vr => vr.VendorId).Contains(v.Id))
            .Select(v => new { v.Id, ProductCount = v.Products.Count })
            .ToDictionaryAsync(x => x.Id, x => x.ProductCount, ct);

        var topVendors = vendorRevenues.Select(vr => new VendorPerformanceDto(
            vr.VendorId, vr.Name,
            productCounts.TryGetValue(vr.VendorId, out var pc) ? pc : 0,
            vr.Revenue
        )).ToList();

        return new DashboardStats(totalSales, totalOrders, totalProducts, lowStockCount, topVendors);
    }
}
