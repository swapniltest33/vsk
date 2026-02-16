using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IVendorService
{
    Task<IEnumerable<VendorDto>> GetAllAsync(CancellationToken ct = default);
    Task<VendorDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<VendorDto> CreateAsync(CreateVendorRequest request, CancellationToken ct = default);
    Task<VendorDto?> UpdateAsync(int id, UpdateVendorRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
