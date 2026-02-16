using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface ISubCategoryService
{
    Task<IEnumerable<SubCategoryDto>> GetAllAsync(int? categoryId = null, CancellationToken ct = default);
    Task<SubCategoryDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<SubCategoryDto> CreateAsync(CreateSubCategoryRequest request, CancellationToken ct = default);
    Task<SubCategoryDto?> UpdateAsync(int id, UpdateSubCategoryRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
