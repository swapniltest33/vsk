using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
}
