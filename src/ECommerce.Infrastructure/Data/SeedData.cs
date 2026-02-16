using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Data;

public static class SeedData
{
    public static async Task InitializeAsync(ECommerceDbContext db)
    {
        if (await db.Users.AnyAsync()) return;

        var adminHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        var vendorHash = BCrypt.Net.BCrypt.HashPassword("Vendor123!");
        var customerHash = BCrypt.Net.BCrypt.HashPassword("Customer123!");

        var users = new[]
        {
            new User { Name = "Admin User", Email = "admin@ecommerce.com", PasswordHash = adminHash, Role = UserRole.Admin },
            new User { Name = "Vendor One", Email = "vendor1@ecommerce.com", PasswordHash = vendorHash, Role = UserRole.Vendor },
            new User { Name = "John Customer", Email = "customer@ecommerce.com", PasswordHash = customerHash, Role = UserRole.Customer }
        };
        db.Users.AddRange(users);
        await db.SaveChangesAsync();

        var vendors = new[]
        {
            new Vendor { Name = "Tech Gadgets Inc", ContactInfo = "tech@gadgets.com", Email = "tech@gadgets.com", Phone = "555-0100" },
            new Vendor { Name = "Fashion World", ContactInfo = "info@fashionworld.com", Email = "info@fashionworld.com", Phone = "555-0200" },
            new Vendor { Name = "Home Essentials", ContactInfo = "sales@homeessentials.com", Email = "sales@homeessentials.com", Phone = "555-0300" }
        };
        db.Vendors.AddRange(vendors);
        await db.SaveChangesAsync();

        var categories = new[]
        {
            new Category { Name = "Electronics", Description = "Electronic devices and gadgets" },
            new Category { Name = "Clothing", Description = "Apparel and accessories" },
            new Category { Name = "Home", Description = "Household items and essentials" }
        };
        db.Categories.AddRange(categories);
        await db.SaveChangesAsync();

        var subCategories = new[]
        {
            new SubCategory { Name = "Smartphones", Description = "Mobile phones and accessories", CategoryId = categories[0].Id },
            new SubCategory { Name = "Laptops", Description = "Portable computers", CategoryId = categories[0].Id },
            new SubCategory { Name = "Men's Wear", Description = "Clothing for men", CategoryId = categories[1].Id },
            new SubCategory { Name = "Kitchen", Description = "Kitchen appliances", CategoryId = categories[2].Id }
        };
        db.SubCategories.AddRange(subCategories);
        await db.SaveChangesAsync();

        var products = new[]
        {
            new Product { Name = "Wireless Headphones", Description = "High-quality wireless headphones with noise cancellation", CategoryId = categories[0].Id, Price = 89.99m, Stock = 50, VendorId = 1 },
            new Product { Name = "Smart Watch", Description = "Feature-rich smartwatch with health tracking", CategoryId = categories[0].Id, Price = 199.99m, Stock = 30, VendorId = 1 },
            new Product { Name = "USB-C Hub", Description = "7-in-1 USB-C hub for laptops", CategoryId = categories[0].Id, Price = 49.99m, Stock = 100, VendorId = 1 },
            new Product { Name = "Classic T-Shirt", Description = "100% cotton classic fit t-shirt", CategoryId = categories[1].Id, SubCategoryId = subCategories[2].Id, Price = 24.99m, Stock = 200, VendorId = 2 },
            new Product { Name = "Denim Jeans", Description = "Comfortable slim fit denim jeans", CategoryId = categories[1].Id, SubCategoryId = subCategories[2].Id, Price = 59.99m, Stock = 75, VendorId = 2 },
            new Product { Name = "Winter Jacket", Description = "Warm insulated winter jacket", CategoryId = categories[1].Id, SubCategoryId = subCategories[2].Id, Price = 129.99m, Stock = 25, VendorId = 2 },
            new Product { Name = "Coffee Maker", Description = "Programmable drip coffee maker", CategoryId = categories[2].Id, SubCategoryId = subCategories[3].Id, Price = 79.99m, Stock = 40, VendorId = 3 },
            new Product { Name = "Kitchen Blender", Description = "High-powered kitchen blender", CategoryId = categories[2].Id, SubCategoryId = subCategories[3].Id, Price = 69.99m, Stock = 35, VendorId = 3 },
            new Product { Name = "Desk Lamp", Description = "LED desk lamp with adjustable brightness", CategoryId = categories[2].Id, Price = 34.99m, Stock = 60, VendorId = 3 }
        };
        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        var customer = await db.Users.FirstAsync(u => u.Role == UserRole.Customer);
        var order = new Order
        {
            UserId = customer.Id,
            Status = OrderStatus.Delivered,
            ShippingAddress = "123 Main St, City",
            TotalAmount = 139.98m
        };
        order.OrderItems.Add(new OrderItem { ProductId = 1, Quantity = 1, Price = 89.99m });
        order.OrderItems.Add(new OrderItem { ProductId = 4, Quantity = 2, Price = 24.99m });
        db.Orders.Add(order);
        await db.SaveChangesAsync();
    }
}
