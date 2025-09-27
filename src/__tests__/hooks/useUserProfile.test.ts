
import { renderHook, waitFor } from '@testing-library/react';
import { useUserProfile } from '@/hooks/useUserProfile';

// Mock do Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
};

jest.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}));

// Mock do AuthContext
const mockAuthUser = {
  id: 'user-123',
  email: 'test@example.com',
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockAuthUser,
  }),
}));

describe('useUserProfile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user profile successfully', async () => {
    const mockUserData = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Style_-_Wouldn%27t_It_Be_Nice.png',
    };

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockUserData,
      error: null,
    });

    const { result } = renderHook(() => useUserProfile());

    // Inicialmente deve estar carregando
    expect(result.current.loading).toBe(true);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(null);

    // Aguarda o carregamento
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockUserData);
    expect(result.current.error).toBe(null);
  });

  it('handles error when fetching profile fails', async () => {
    const mockError = { message: 'Failed to fetch profile' };

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe('Failed to fetch profile');
  });

  it('does not fetch profile when user is not authenticated', () => {
    // Mock sem usuário autenticado
    jest.mocked(require('@/contexts/AuthContext').useAuth).mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.loading).toBe(false);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('resets profile when user logs out', async () => {
    // Primeiro renderiza com usuário
    const { result, rerender } = renderHook(() => useUserProfile());

    // Mock usuário deslogado
    jest.mocked(require('@/contexts/AuthContext').useAuth).mockReturnValue({
      user: null,
    });

    rerender();

    expect(result.current.profile).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
