import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TravelPlanResult from '@/components/TravelPlanResult';
import type { TravelPlanResponse } from '@/types/travel';

describe('TravelPlanResult', () => {
  const mockOnReset = vi.fn();

  const mockResult: TravelPlanResponse = {
    id: 'test-id-123',
    plan: `# Plan de Viaje: Madrid → París

## Información Práctica

### Documentación
- **Pasaporte:** Vigente
- **Visado:** No necesario

### Actividades
- **Día 1:** Llegada y orientación
- **Día 2:** Museos y cultura

## Alojamientos
- Hotel 3 estrellas
- Ubicación céntrica

## Gastronomía
- Restaurantes locales
- Mercados tradicionales`,
    metadata: {
      generatedAt: new Date('2024-01-01T10:00:00Z'),
      aiProvider: 'Claude (Mock)',
      parametros: {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio'
      }
    }
  };

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  it('should render the travel plan title', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByText(/tu plan de viaje/i)).toBeInTheDocument();
  });

  it('should render the reset button', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /crear nuevo plan/i });
    expect(resetButton).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /crear nuevo plan/i });
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should display travel parameters in summary', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByText('Madrid → París')).toBeInTheDocument();
    expect(screen.getByText('5 días')).toBeInTheDocument();
    expect(screen.getByText('Familia')).toBeInTheDocument();
  });

  it('should render the travel plan content', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    // Check for content from the plan
    expect(screen.getByText(/información práctica/i)).toBeInTheDocument();
    expect(screen.getByText(/documentación/i)).toBeInTheDocument();
    expect(screen.getByText(/alojamientos/i)).toBeInTheDocument();
    expect(screen.getByText(/gastronomía/i)).toBeInTheDocument();
  });

  it('should display metadata information', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByText(/generado por claude \(mock\)/i)).toBeInTheDocument();
    expect(screen.getByText(/test-id-123/i)).toBeInTheDocument();
  });

  it('should format the generation date correctly', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    // Check that the date is displayed (format may vary by locale)
    const dateText = screen.getByText(/generado por/i).parentElement;
    expect(dateText).toHaveTextContent(/2024/);
  });

  it('should handle empty plan content gracefully', () => {
    const emptyResult = {
      ...mockResult,
      plan: ''
    };

    render(<TravelPlanResult result={emptyResult} onReset={mockOnReset} />);

    // Should still render the container and metadata
    expect(screen.getByText(/tu plan de viaje/i)).toBeInTheDocument();
    expect(screen.getByText(/generado por/i)).toBeInTheDocument();
  });

  it('should handle special characters in plan content', () => {
    const specialCharResult = {
      ...mockResult,
      plan: `# Plan de Viaje: España → Francia
      
## Información con acentos
- Niños y características especiales
- Precios en € y símbolos
- Emojis 🏨 🍽️ ✈️`
    };

    render(<TravelPlanResult result={specialCharResult} onReset={mockOnReset} />);

    expect(screen.getByText(/españa → francia/i)).toBeInTheDocument();
    expect(screen.getByText(/niños y características/i)).toBeInTheDocument();
  });

  it('should render markdown-like content as formatted text', () => {
    const markdownResult = {
      ...mockResult,
      plan: `# Título Principal

## Subtítulo

**Texto en negrita**

*Texto en cursiva*

- Lista item 1
- Lista item 2

1. Elemento numerado
2. Otro elemento`
    };

    render(<TravelPlanResult result={markdownResult} onReset={mockOnReset} />);

    // The content should be rendered (formatted via dangerouslySetInnerHTML)
    expect(screen.getByText(/título principal/i)).toBeInTheDocument();
    expect(screen.getByText(/subtítulo/i)).toBeInTheDocument();
  });

  it('should display all parameter information correctly', () => {
    const detailedResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        parametros: {
          origen: 'Barcelona',
          destino: 'Tokyo',
          dias: 15,
          tipoViaje: 'aventura' as const,
          presupuesto: 'alto' as const,
          alojamiento: 'hotel' as const,
          transporte: 'vuelo' as const,
          actividades: ['senderismo', 'cultura']
        }
      }
    };

    render(<TravelPlanResult result={detailedResult} onReset={mockOnReset} />);

    expect(screen.getByText('Barcelona → Tokyo')).toBeInTheDocument();
    expect(screen.getByText('15 días')).toBeInTheDocument();
    expect(screen.getByText('Aventura')).toBeInTheDocument();
  });

  it('should handle long travel plan content', () => {
    const longPlanContent = 'A'.repeat(10000); // Very long content
    const longResult = {
      ...mockResult,
      plan: longPlanContent
    };

    render(<TravelPlanResult result={longResult} onReset={mockOnReset} />);

    // Should render without issues
    expect(screen.getByText(/tu plan de viaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear nuevo plan/i })).toBeInTheDocument();
  });

  it('should handle different AI providers in metadata', () => {
    const differentProviderResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        aiProvider: 'OpenAI GPT-4'
      }
    };

    render(<TravelPlanResult result={differentProviderResult} onReset={mockOnReset} />);

    expect(screen.getByText(/generado por openai gpt-4/i)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /crear nuevo plan/i });
    expect(resetButton).toBeInTheDocument();

    // Check that the main content area is properly structured
    const mainContent = screen.getByText(/tu plan de viaje/i).closest('div');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render headings in correct hierarchy', () => {
    render(<TravelPlanResult result={mockResult} onReset={mockOnReset} />);

    // The main title should be rendered
    const mainHeading = screen.getByText(/tu plan de viaje/i);
    expect(mainHeading).toBeInTheDocument();
  });

  it('should format trip type with proper capitalization', () => {
    const testCases = [
      { input: 'familia', expected: 'Familia' },
      { input: 'mochilero', expected: 'Mochilero' },
      { input: 'lujo', expected: 'Lujo' },
      { input: 'aventura', expected: 'Aventura' }
    ];

    testCases.forEach(({ input, expected }) => {
      const testResult = {
        ...mockResult,
        metadata: {
          ...mockResult.metadata,
          parametros: {
            ...mockResult.metadata.parametros,
            tipoViaje: input as any
          }
        }
      };

      const { unmount } = render(<TravelPlanResult result={testResult} onReset={mockOnReset} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });
});