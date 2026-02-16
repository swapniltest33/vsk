using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public class VendorService : IVendorService
{
    private readonly ECommerceDbContext _db;

    public VendorService(ECommerceDbContext db) => _db = db;

    public async Task<IEnumerable<VendorDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Vendors
            .Select(v => new VendorDto(v.Id, v.Name, v.ContactInfo, v.Email, v.Phone, v.Products.Count))
            .ToListAsync(ct);
    }

    public async Task<VendorDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var v = await _db.Vendors.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id, ct);
        return v == null ? null : new VendorDto(v.Id, v.Name, v.ContactInfo, v.Email, v.Phone, v.Products.Count);
    }

    public async Task<VendorDto> CreateAsync(CreateVendorRequest request, CancellationToken ct = default)
    {
        var vendor = new Vendor
        {
            Name = request.Name,
            ContactInfo = request.ContactInfo,
            Email = request.Email,
            Phone = request.Phone
        };
        _db.Vendors.Add(vendor);
        await _db.SaveChangesAsync(ct);
        return new VendorDto(vendor.Id, vendor.Name, vendor.ContactInfo, vendor.Email, vendor.Phone, 0);
    }

    public async Task<VendorDto?> UpdateAsync(int id, UpdateVendorRequest request, CancellationToken ct = default)
    {
        var v = await _db.Vendors.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (v == null) return null;

        if (request.Name != null) v.Name = request.Name;
        if (request.ContactInfo != null) v.ContactInfo = request.ContactInfo;
        if (request.Email != null) v.Email = request.Email;
        if (request.Phone != null) v.Phone = request.Phone;

        await _db.SaveChangesAsync(ct);
        return new VendorDto(v.Id, v.Name, v.ContactInfo, v.Email, v.Phone, v.Products.Count);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var v = await _db.Vendors.FindAsync([id], ct);
        if (v == null) return false;
        _db.Vendors.Remove(v);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
