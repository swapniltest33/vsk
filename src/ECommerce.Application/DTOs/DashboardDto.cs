namespace ECommerce.Application.DTOs;

public record DashboardStats(
    decimal TotalSales,
    int TotalOrders,
    int TotalProducts,
    int LowStockCount,
    List<VendorPerformanceDto> TopVendors
);

public record VendorPerformanceDto(int VendorId, string VendorName, int ProductCount, decimal TotalRevenue);
