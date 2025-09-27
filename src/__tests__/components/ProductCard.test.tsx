
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '@/components/marketplace/ProductCard';
import { Product } from '@/lib/types';

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock do useApp hook
const mockDispatch = jest.fn();
const mockState = {
  favorites: [],
  cart: [],
};

jest.mock('@/lib/simple-store', () => ({
  useApp: () => ({
    state: mockState,
    dispatch: mockDispatch,
  }),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Produto Teste',
  price: 29.99,
  originalPrice: 39.99,
  rating: 4.5,
  reviews: 123,
  badge: 'Novo',
  badgeColor: 'bg-green-500',
  image: '/test-image.jpg',
  description: 'Descrição do produto teste',
  category: 'Categoria Teste',
  inStock: true,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.favorites = [];
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 29,99')).toBeInTheDocument();
    expect(screen.getByText('R$ 39,99')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(123)')).toBeInTheDocument();
  });

  it('adds product to cart when add button is clicked', async () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_TO_CART',
      payload: mockProduct,
    });
  });

  it('toggles favorite when heart button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    const favoriteButton = screen.getByRole('button', { name: /favorito/i });
    fireEvent.click(favoriteButton);
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_FAVORITE',
      payload: mockProduct.id,
    });
  });

  it('shows different heart icon when product is favorited', () => {
    mockState.favorites = ['1'];
    
    render(<ProductCard product={mockProduct} />);
    
    const favoriteButton = screen.getByRole('button', { name: /favorito/i });
    expect(favoriteButton).toHaveClass('bg-red-500'); // Assumindo que favoritos têm classe vermelha
  });

  it('prevents navigation when action buttons are clicked', () => {
    const mockPreventDefault = jest.fn();
    
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    const favoriteButton = screen.getByRole('button', { name: /favorito/i });
    
    // Simula o evento com preventDefault
    const clickEvent = { preventDefault: mockPreventDefault } as any;
    
    fireEvent.click(addButton, clickEvent);
    fireEvent.click(favoriteButton, clickEvent);
    
    expect(mockPreventDefault).toHaveBeenCalledTimes(2);
  });

  it('shows loading state when adding to cart', async () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    
    // Verifica se o botão mostra estado de loading
    expect(addButton).toBeDisabled();
    
    // Aguarda o estado de loading terminar
    await waitFor(() => {
      expect(addButton).not.toBeDisabled();
    }, { timeout: 1500 });
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    
    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/marketplace/produto/1');
  });

  it('displays badge with correct styling', () => {
    render(<ProductCard product={mockProduct} />);
    
    const badge = screen.getByText('Novo');
    expect(badge).toHaveClass('bg-green-500');
  });

  it('handles product without badge', () => {
    const productWithoutBadge = { ...mockProduct, badge: undefined };
    
    render(<ProductCard product={productWithoutBadge} />);
    
    expect(screen.queryByText('Novo')).not.toBeInTheDocument();
  });
});
