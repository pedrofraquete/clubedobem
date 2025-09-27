
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock do UserNav component
jest.mock('@/components/UserNav', () => {
  return function MockUserNav() {
    return <div data-testid="user-nav">UserNav</div>;
  };
});

// Mock do scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('Header Component', () => {
  beforeEach(() => {
    // Mock getElementById
    document.getElementById = jest.fn((id) => ({
      scrollIntoView: jest.fn(),
    })) as any;
  });

  it('renders the header with logo and navigation', () => {
    render(<Header />);
    
    // Verifica se o logo está presente
    expect(screen.getByText('Clube do Bem')).toBeInTheDocument();
    expect(screen.getByText('BRASIL')).toBeInTheDocument();
    
    // Verifica se os itens de navegação estão presentes
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Impacto')).toBeInTheDocument();
    expect(screen.getByText('MultiMais')).toBeInTheDocument();
    expect(screen.getByText('Parceiros')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Header />);
    
    // Encontra o botão do menu mobile
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // Clica no botão do menu
    fireEvent.click(menuButton);
    
    // Verifica se o menu mobile está visível (assumindo que há uma classe ou atributo que indica isso)
    // Como não temos acesso ao estado interno, vamos verificar se o ícone mudou
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('scrolls to section when navigation item is clicked', () => {
    const mockScrollIntoView = jest.fn();
    document.getElementById = jest.fn(() => ({
      scrollIntoView: mockScrollIntoView,
    })) as any;

    render(<Header />);
    
    // Clica no item "Início"
    const inicioButton = screen.getByText('Início');
    fireEvent.click(inicioButton);
    
    // Verifica se getElementById foi chamado com o ID correto
    expect(document.getElementById).toHaveBeenCalledWith('home');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('scrolls to home when logo is clicked', () => {
    const mockScrollIntoView = jest.fn();
    document.getElementById = jest.fn(() => ({
      scrollIntoView: mockScrollIntoView,
    })) as any;

    render(<Header />);
    
    // Clica no logo
    const logo = screen.getByText('Clube do Bem').closest('div');
    fireEvent.click(logo!);
    
    // Verifica se scrollIntoView foi chamado
    expect(document.getElementById).toHaveBeenCalledWith('home');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('renders UserNav component', () => {
    render(<Header />);
    
    expect(screen.getByTestId('user-nav')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);
    
    // Verifica se o nav tem o papel correto
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Verifica se os botões têm labels apropriados
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
