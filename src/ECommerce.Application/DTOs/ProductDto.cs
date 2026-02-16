namespace ECommerce.Application.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string Description,
    int CategoryId,
    string CategoryName,
    int? SubCategoryId,
    string? SubCategoryName,
    decimal Price,
    int Stock,
    string? ImageUrl,
    int VendorId,
    string? VendorName
);

public record CreateProductRequest(
    string Name,
    string Description,
    int CategoryId,
    int? SubCategoryId,
    decimal Price,
    int Stock,
    int VendorId,
    string? ImageUrl = null
);

public record UpdateProductRequest(
    string? Name = null,
    string? Description = null,
    int? CategoryId = null,
    int? SubCategoryId = null,
    decimal? Price = null,
    int? Stock = null,
    string? ImageUrl = null
);
