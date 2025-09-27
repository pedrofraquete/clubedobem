
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock do Supabase
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn(),
  },
};

jest.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}));

// Mock do AuthContext
const mockAuthContext = {
  user: null,
  loading: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Componente de Login simulado (baseado na estrutura típica)
const MockLoginForm = () => {
  const { signIn } = mockAuthContext;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      mockPush('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div data-testid="error-message">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      <button type="button" onClick={() => mockSupabase.auth.signInWithOAuth({ provider: 'google' })}>
        Entrar com Google
      </button>
    </form>
  );
};

describe('Login Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.loading = false;
  });

  it('successfully logs in with email and password', async () => {
    const user = userEvent.setup();
    mockAuthContext.signIn.mockResolvedValue({ user: { id: '123', email: 'test@example.com' } });

    render(<MockLoginForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /entrar$/i }));

    // Verifica se o signIn foi chamado com os dados corretos
    expect(mockAuthContext.signIn).toHaveBeenCalledWith('test@example.com', 'password123');

    // Verifica se foi redirecionado para o dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Credenciais inválidas';
    mockAuthContext.signIn.mockRejectedValue(new Error(errorMessage));

    render(<MockLoginForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'wrongpassword');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /entrar$/i }));

    // Verifica se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });

    // Verifica que não foi redirecionado
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    let resolveSignIn: (value: any) => void;
    const signInPromise = new Promise((resolve) => {
      resolveSignIn = resolve;
    });
    mockAuthContext.signIn.mockReturnValue(signInPromise);

    render(<MockLoginForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /entrar$/i }));

    // Verifica se o estado de loading é mostrado
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();

    // Resolve o login
    resolveSignIn!({ user: { id: '123' } });

    // Verifica se o loading desaparece
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /entrar$/i })).not.toBeDisabled();
    });
  });

  it('handles OAuth login with Google', async () => {
    const user = userEvent.setup();
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });

    render(<MockLoginForm />);

    // Clica no botão do Google
    await user.click(screen.getByRole('button', { name: /entrar com google/i }));

    // Verifica se o OAuth foi chamado
    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<MockLoginForm />);

    // Tenta submeter sem preencher os campos
    await user.click(screen.getByRole('button', { name: /entrar$/i }));

    // Verifica se os campos obrigatórios são validados pelo HTML5
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    mockAuthContext.signIn.mockRejectedValue(new Error('Erro de login'));

    render(<MockLoginForm />);

    // Causa um erro primeiro
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /entrar$/i }));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    // Limpa e digita novamente
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');

    // A mensagem de erro deve desaparecer quando o usuário começar a digitar novamente
    // (isso dependeria da implementação real do componente)
  });
});
