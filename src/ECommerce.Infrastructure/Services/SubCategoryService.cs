using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class SubCategoryService : ISubCategoryService
{
    private readonly ECommerceDbContext _context;

    public SubCategoryService(ECommerceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SubCategoryDto>> GetAllAsync(int? categoryId = null, CancellationToken ct = default)
    {
        var query = _context.SubCategories.Include(sc => sc.Category).AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(sc => sc.CategoryId == categoryId.Value);
        }

        return await query
            .Select(sc => new SubCategoryDto(sc.Id, sc.Name, sc.Description, sc.CategoryId, sc.Category.Name))
            .ToListAsync(ct);
    }

    public async Task<SubCategoryDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var subCategory = await _context.SubCategories
            .Include(sc => sc.Category)
            .FirstOrDefaultAsync(sc => sc.Id == id, ct);

        if (subCategory == null) return null;

        return new SubCategoryDto(subCategory.Id, subCategory.Name, subCategory.Description, subCategory.CategoryId, subCategory.Category.Name);
    }

    public async Task<SubCategoryDto> CreateAsync(CreateSubCategoryRequest request, CancellationToken ct = default)
    {
        var subCategory = new SubCategory
        {
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId
        };

        _context.SubCategories.Add(subCategory);
        await _context.SaveChangesAsync(ct);

        // Fetch again to include Category name
        return await GetByIdAsync(subCategory.Id, ct) ?? throw new InvalidOperationException("Failed to retrieve created subcategory");
    }

    public async Task<SubCategoryDto?> UpdateAsync(int id, UpdateSubCategoryRequest request, CancellationToken ct = default)
    {
        var subCategory = await _context.SubCategories.FindAsync(new object[] { id }, ct);
        if (subCategory == null) return null;

        subCategory.Name = request.Name;
        subCategory.Description = request.Description;
        subCategory.CategoryId = request.CategoryId;

        await _context.SaveChangesAsync(ct);

        return await GetByIdAsync(subCategory.Id, ct);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var subCategory = await _context.SubCategories.FindAsync(new object[] { id }, ct);
        if (subCategory == null) return false;

        _context.SubCategories.Remove(subCategory);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
