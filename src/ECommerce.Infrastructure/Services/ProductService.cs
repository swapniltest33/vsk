using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly ECommerceDbContext _db;

    public ProductService(ECommerceDbContext db) => _db = db;

    public async Task<IEnumerable<ProductDto>> GetAllAsync(int? categoryId = null, int? subCategoryId = null, string? search = null, CancellationToken ct = default)
    {
        var query = _db.Products
            .Include(p => p.Vendor)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);
        
        if (subCategoryId.HasValue)
            query = query.Where(p => p.SubCategoryId == subCategoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        return await query.Select(p => new ProductDto(
            p.Id, p.Name, p.Description, p.CategoryId, p.Category.Name, 
            p.SubCategoryId, p.SubCategory != null ? p.SubCategory.Name : null,
            p.Price, p.Stock, p.ImageUrl,
            p.VendorId, p.Vendor.Name
        )).ToListAsync(ct);
    }

    public async Task<ProductDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var p = await _db.Products
            .Include(x => x.Vendor)
            .Include(x => x.Category)
            .Include(x => x.SubCategory)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (p == null) return null;

        return new ProductDto(
            p.Id, p.Name, p.Description, p.CategoryId, p.Category.Name,
            p.SubCategoryId, p.SubCategory?.Name,
            p.Price, p.Stock, p.ImageUrl, p.VendorId, p.Vendor.Name);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId,
            SubCategoryId = request.SubCategoryId,
            Price = request.Price,
            Stock = request.Stock,
            VendorId = request.VendorId,
            ImageUrl = request.ImageUrl
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);
        
        return await GetByIdAsync(product.Id, ct) ?? throw new InvalidOperationException("Product creation failed");
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var p = await _db.Products.FindAsync(new object[] { id }, ct);
        if (p == null) return null;

        if (request.Name != null) p.Name = request.Name;
        if (request.Description != null) p.Description = request.Description;
        if (request.CategoryId.HasValue) p.CategoryId = request.CategoryId.Value;
        if (request.SubCategoryId.HasValue) p.SubCategoryId = request.SubCategoryId;
        if (request.Price.HasValue) p.Price = request.Price.Value;
        if (request.Stock.HasValue) p.Stock = request.Stock.Value;
        if (request.ImageUrl != null) p.ImageUrl = request.ImageUrl;
        p.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return await GetByIdAsync(id, ct);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var p = await _db.Products.FindAsync([id], ct);
        if (p == null) return false;
        _db.Products.Remove(p);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
