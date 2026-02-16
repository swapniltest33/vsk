namespace ECommerce.Application.DTOs;

public record VendorDto(int Id, string Name, string ContactInfo, string? Email, string? Phone, int ProductCount);
public record CreateVendorRequest(string Name, string ContactInfo, string? Email = null, string? Phone = null);
public record UpdateVendorRequest(string? Name = null, string? ContactInfo = null, string? Email = null, string? Phone = null);
