namespace ECommerce.Application.DTOs;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password, string Role = "Customer");
public record AuthResponse(string Token, string Email, string Name, string Role, int UserId);
