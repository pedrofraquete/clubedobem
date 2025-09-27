
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock do Supabase
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(),
    })),
  })),
};

jest.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}));

// Mock do AuthContext
const mockAuthContext = {
  user: null,
  loading: false,
  signUp: jest.fn(),
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock do Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Componente de Signup simulado
const MockSignupForm = () => {
  const { signUp } = mockAuthContext;
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(''); // Limpa erro ao digitar
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div data-testid="success-message">
        Conta criada com sucesso! Verifique seu email para confirmar.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="signup-form">
      <div>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div data-testid="error-message">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
};

describe('Signup Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully creates a new account', async () => {
    const user = userEvent.setup();
    mockAuthContext.signUp.mockResolvedValue({
      user: { id: '123', email: 'test@example.com' },
    });

    render(<MockSignupForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se o signUp foi chamado com os dados corretos
    expect(mockAuthContext.signUp).toHaveBeenCalledWith(
      'joao@example.com',
      'password123',
      { name: 'João Silva' }
    );

    // Verifica se a mensagem de sucesso é exibida
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<MockSignupForm />);

    // Preenche o formulário com senhas diferentes
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password456');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se a mensagem de erro é exibida
    expect(screen.getByTestId('error-message')).toHaveTextContent('As senhas não coincidem');

    // Verifica que o signUp não foi chamado
    expect(mockAuthContext.signUp).not.toHaveBeenCalled();
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();

    render(<MockSignupForm />);

    // Preenche o formulário com senha muito curta
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), '123');
    await user.type(screen.getByLabelText(/confirmar senha/i), '123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se a mensagem de erro é exibida
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'A senha deve ter pelo menos 6 caracteres'
    );
  });

  it('shows error when signup fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Email já está em uso';
    mockAuthContext.signUp.mockRejectedValue(new Error(errorMessage));

    render(<MockSignupForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('shows loading state during signup', async () => {
    const user = userEvent.setup();
    let resolveSignUp: (value: any) => void;
    const signUpPromise = new Promise((resolve) => {
      resolveSignUp = resolve;
    });
    mockAuthContext.signUp.mockReturnValue(signUpPromise);

    render(<MockSignupForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se o estado de loading é mostrado
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled();

    // Resolve o signup
    resolveSignUp!({ user: { id: '123' } });

    // Verifica se o loading desaparece
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup();

    render(<MockSignupForm />);

    // Causa um erro primeiro
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password456');
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se o erro aparece
    expect(screen.getByTestId('error-message')).toBeInTheDocument();

    // Digita novamente no campo de confirmar senha
    await user.clear(screen.getByLabelText(/confirmar senha/i));
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');

    // O erro deve desaparecer
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<MockSignupForm />);

    // Tenta submeter sem preencher os campos
    await user.click(screen.getByRole('button', { name: /criar conta$/i }));

    // Verifica se os campos obrigatórios são validados
    expect(screen.getByLabelText(/nome/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/^senha$/i)).toBeRequired();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeRequired();
  });
});
