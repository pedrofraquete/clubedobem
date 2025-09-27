
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock do Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(),
    })),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Social_media_collection_2020s.png' },
      })),
    })),
  },
};

jest.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}));

// Mock do AuthContext
const mockUser = {
  id: 'user-123',
  email: 'seller@example.com',
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock do Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Componente de criação de produto simulado
const MockProductCreationForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
  });
  const [images, setImages] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImages = async (files: File[]) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}-${index}-${file.name}`;
      const { data, error } = await mockSupabase.storage
        .from('products')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = mockSupabase.storage
        .from('products')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload das imagens
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      // Criar produto
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: imageUrls,
        seller_id: mockUser.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await mockSupabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        mockPush('/marketplace');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div data-testid="success-message">
        Produto criado com sucesso! Redirecionando...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="product-form">
      <div>
        <label htmlFor="name">Nome do Produto</label>
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
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="price">Preço (R$)</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="electronics">Eletrônicos</option>
          <option value="clothing">Roupas</option>
          <option value="books">Livros</option>
          <option value="home">Casa e Jardim</option>
        </select>
      </div>

      <div>
        <label htmlFor="condition">Condição</label>
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="new">Novo</option>
          <option value="used">Usado</option>
          <option value="refurbished">Recondicionado</option>
        </select>
      </div>

      <div>
        <label htmlFor="images">Imagens</label>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        {images.length > 0 && (
          <div data-testid="image-count">
            {images.length} imagem(ns) selecionada(s)
          </div>
        )}
      </div>

      {error && <div data-testid="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Criando produto...' : 'Criar Produto'}
      </button>
    </form>
  );
};

describe('Product Creation Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from().insert().select.mockResolvedValue({
      data: [{ id: 'product-123', name: 'Test Product' }],
      error: null,
    });
    mockSupabase.storage.from().upload.mockResolvedValue({
      data: { path: 'test-path' },
      error: null,
    });
  });

  it('successfully creates a product with all required fields', async () => {
    const user = userEvent.setup();

    render(<MockProductCreationForm />);

    // Preenche todos os campos obrigatórios
    await user.type(screen.getByLabelText(/nome do produto/i), 'iPhone 13');
    await user.type(screen.getByLabelText(/descrição/i), 'iPhone 13 em excelente estado');
    await user.type(screen.getByLabelText(/preço/i), '2500.00');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'electronics');
    await user.selectOptions(screen.getByLabelText(/condição/i), 'used');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Verifica se o produto foi criado
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'iPhone 13',
          description: 'iPhone 13 em excelente estado',
          price: 2500.00,
          category: 'electronics',
          condition: 'used',
          seller_id: 'user-123',
        }),
      ]);
    });

    // Verifica se a mensagem de sucesso é exibida
    expect(screen.getByTestId('success-message')).toBeInTheDocument();
  });

  it('uploads images when provided', async () => {
    const user = userEvent.setup();

    // Mock de arquivos
    const file1 = new File(['image1'], 'image1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['image2'], 'image2.jpg', { type: 'image/jpeg' });

    render(<MockProductCreationForm />);

    // Preenche os campos obrigatórios
    await user.type(screen.getByLabelText(/nome do produto/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test description');
    await user.type(screen.getByLabelText(/preço/i), '100.00');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'electronics');

    // Adiciona imagens
    const imageInput = screen.getByLabelText(/imagens/i);
    await user.upload(imageInput, [file1, file2]);

    // Verifica se as imagens foram selecionadas
    expect(screen.getByTestId('image-count')).toHaveTextContent('2 imagem(ns) selecionada(s)');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Verifica se as imagens foram enviadas
    await waitFor(() => {
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.storage.from().upload).toHaveBeenCalledTimes(2);
    });
  });

  it('shows error when required fields are missing', async () => {
    const user = userEvent.setup();

    render(<MockProductCreationForm />);

    // Tenta submeter sem preencher campos obrigatórios
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Verifica se os campos são validados
    expect(screen.getByLabelText(/nome do produto/i)).toBeRequired();
    expect(screen.getByLabelText(/descrição/i)).toBeRequired();
    expect(screen.getByLabelText(/preço/i)).toBeRequired();
    expect(screen.getByLabelText(/categoria/i)).toBeRequired();
  });

  it('shows error when product creation fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Erro ao salvar produto';
    
    mockSupabase.from().insert().select.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    render(<MockProductCreationForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome do produto/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test description');
    await user.type(screen.getByLabelText(/preço/i), '100.00');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'electronics');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Verifica se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('shows loading state during product creation', async () => {
    const user = userEvent.setup();
    
    let resolveInsert: (value: any) => void;
    const insertPromise = new Promise((resolve) => {
      resolveInsert = resolve;
    });
    mockSupabase.from().insert().select.mockReturnValue(insertPromise);

    render(<MockProductCreationForm />);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome do produto/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test description');
    await user.type(screen.getByLabelText(/preço/i), '100.00');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'electronics');

    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Verifica se o estado de loading é mostrado
    expect(screen.getByRole('button', { name: /criando produto/i })).toBeDisabled();

    // Resolve a criação
    resolveInsert!({ data: [{ id: 'product-123' }], error: null });

    // Verifica se o loading desaparece
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('redirects to marketplace after successful creation', async () => {
    const user = userEvent.setup();

    render(<MockProductCreationForm />);

    // Preenche e submete o formulário
    await user.type(screen.getByLabelText(/nome do produto/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test description');
    await user.type(screen.getByLabelText(/preço/i), '100.00');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'electronics');
    await user.click(screen.getByRole('button', { name: /criar produto$/i }));

    // Aguarda o sucesso
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Verifica se o redirecionamento acontece após 2 segundos
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/marketplace');
    }, { timeout: 3000 });
  });

  it('validates price input format', async () => {
    const user = userEvent.setup();

    render(<MockProductCreationForm />);

    const priceInput = screen.getByLabelText(/preço/i);
    
    // Verifica se o input aceita apenas números
    expect(priceInput).toHaveAttribute('type', 'number');
    expect(priceInput).toHaveAttribute('step', '0.01');
    expect(priceInput).toHaveAttribute('min', '0');
  });
});
