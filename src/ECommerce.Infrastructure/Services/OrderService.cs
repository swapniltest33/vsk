using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ECommerceDbContext _db;

    public OrderService(ECommerceDbContext db) => _db = db;

    public async Task<IEnumerable<OrderDto>> GetAllAsync(string? status = null, int? userId = null, CancellationToken ct = default)
    {
        var query = _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var s))
            query = query.Where(o => o.Status == s);
        if (userId.HasValue)
            query = query.Where(o => o.UserId == userId.Value);

        var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync(ct);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var o = await _db.Orders
            .Include(x => x.User)
            .Include(x => x.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        return o == null ? null : MapToDto(o);
    }

    public async Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null)
            throw new InvalidOperationException("User session is invalid. Please log out and log in again.");

        var products = await _db.Products
            .Where(p => request.Items.Select(i => i.ProductId).Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);

        var order = new Order
        {
            UserId = userId,
            Status = OrderStatus.Pending,
            ShippingAddress = request.ShippingAddress
        };

        decimal total = 0;
        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product) || product.Stock < item.Quantity)
                throw new InvalidOperationException($"Product {item.ProductId} not found or insufficient stock");

            var price = product.Price * item.Quantity;
            total += price;
            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                Price = product.Price
            });
            product.Stock -= item.Quantity;
        }
        order.TotalAmount = total;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);

        var created = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == order.Id, ct);
        return MapToDto(created);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, string status, CancellationToken ct = default)
    {
        if (!Enum.TryParse<OrderStatus>(status, true, out var s))
            return null;

        var o = await _db.Orders
            .Include(x => x.User)
            .Include(x => x.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (o == null) return null;

        o.Status = s;
        await _db.SaveChangesAsync(ct);
        return MapToDto(o);
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id,
        o.UserId,
        o.User.Name,
        o.OrderDate,
        o.Status.ToString(),
        o.ShippingAddress,
        o.TotalAmount,
        o.OrderItems.Select(oi => new OrderItemDto(oi.ProductId, oi.Product.Name, oi.Quantity, oi.Price)).ToList()
    );
}
