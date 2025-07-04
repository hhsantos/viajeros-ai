import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TravelForm from '../../../src/components/TravelForm';
import type { TravelPlanRequest } from '../../../src/types/travel';

describe('TravelForm', () => {
  const mockOnSubmit = vi.fn();
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    loading: false
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render all form fields', () => {
    render(<TravelForm {...defaultProps} />);

    expect(screen.getByLabelText(/origen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destino/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/días/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de viaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presupuesto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/alojamiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transporte/i)).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    render(<TravelForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /generar plan de viaje/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('should show loading state when loading prop is true', () => {
    render(<TravelForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/generando plan/i)).toBeInTheDocument();
  });

  it('should have default values set correctly', () => {
    render(<TravelForm {...defaultProps} />);

    expect(screen.getByDisplayValue('7')).toBeInTheDocument(); // días default
    expect(screen.getByDisplayValue('familia')).toBeInTheDocument(); // tipoViaje default
    expect(screen.getByDisplayValue('medio')).toBeInTheDocument(); // presupuesto default
  });

  it('should update input values when user types', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    const origenInput = screen.getByLabelText(/origen/i);
    const destinoInput = screen.getByLabelText(/destino/i);

    await user.type(origenInput, 'Madrid');
    await user.type(destinoInput, 'París');

    expect(origenInput).toHaveValue('Madrid');
    expect(destinoInput).toHaveValue('París');
  });

  it('should update select values when user selects options', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    const tipoViajeSelect = screen.getByLabelText(/tipo de viaje/i);
    const presupuestoSelect = screen.getByLabelText(/presupuesto/i);

    await user.selectOptions(tipoViajeSelect, 'aventura');
    await user.selectOptions(presupuestoSelect, 'alto');

    expect(tipoViajeSelect).toHaveValue('aventura');
    expect(presupuestoSelect).toHaveValue('alto');
  });

  it('should call onSubmit with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/origen/i), 'Barcelona');
    await user.type(screen.getByLabelText(/destino/i), 'Roma');
    await user.clear(screen.getByLabelText(/días/i));
    await user.type(screen.getByLabelText(/días/i), '10');
    await user.selectOptions(screen.getByLabelText(/tipo de viaje/i), 'cultural');
    await user.selectOptions(screen.getByLabelText(/presupuesto/i), 'alto');
    await user.selectOptions(screen.getByLabelText(/alojamiento/i), 'hotel');
    await user.selectOptions(screen.getByLabelText(/transporte/i), 'vuelo');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /generar plan de viaje/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        origen: 'Barcelona',
        destino: 'Roma',
        dias: 10,
        tipoViaje: 'cultural',
        presupuesto: 'alto',
        alojamiento: 'hotel',
        transporte: 'vuelo',
        actividades: []
      });
    });
  });

  it('should handle optional fields correctly', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    // Fill required fields only
    await user.type(screen.getByLabelText(/origen/i), 'Madrid');
    await user.type(screen.getByLabelText(/destino/i), 'Lisboa');

    // Leave optional fields as default (empty)
    const alojamientoSelect = screen.getByLabelText(/alojamiento/i);
    const transporteSelect = screen.getByLabelText(/transporte/i);
    
    expect(alojamientoSelect).toHaveValue('');
    expect(transporteSelect).toHaveValue('');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /generar plan de viaje/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        origen: 'Madrid',
        destino: 'Lisboa',
        dias: 7,
        tipoViaje: 'familia',
        presupuesto: 'medio',
        alojamiento: undefined,
        transporte: undefined,
        actividades: []
      });
    });
  });

  it('should prevent submission when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /generar plan de viaje/i }));

    // Form should not submit due to HTML5 validation
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate days input range', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    const diasInput = screen.getByLabelText(/días/i);
    
    // Test minimum value
    await user.clear(diasInput);
    await user.type(diasInput, '0');
    expect(diasInput).toHaveValue(0);

    // Test maximum value
    await user.clear(diasInput);
    await user.type(diasInput, '400');
    expect(diasInput).toHaveValue(400);
  });

  it('should have all required trip type options', () => {
    render(<TravelForm {...defaultProps} />);

    const tipoViajeSelect = screen.getByLabelText(/tipo de viaje/i);
    const options = Array.from(tipoViajeSelect.querySelectorAll('option')).map(option => option.value);

    expect(options).toContain('familia');
    expect(options).toContain('mochilero');
    expect(options).toContain('lujo');
    expect(options).toContain('aventura');
    expect(options).toContain('cultural');
    expect(options).toContain('gastronomico');
  });

  it('should have all required budget options', () => {
    render(<TravelForm {...defaultProps} />);

    const presupuestoSelect = screen.getByLabelText(/presupuesto/i);
    const options = Array.from(presupuestoSelect.querySelectorAll('option')).map(option => option.value);

    expect(options).toContain('bajo');
    expect(options).toContain('medio');
    expect(options).toContain('alto');
  });

  it('should have all accommodation options including empty option', () => {
    render(<TravelForm {...defaultProps} />);

    const alojamientoSelect = screen.getByLabelText(/alojamiento/i);
    const options = Array.from(alojamientoSelect.querySelectorAll('option')).map(option => option.value);

    expect(options).toContain('');
    expect(options).toContain('hotel');
    expect(options).toContain('hostal');
    expect(options).toContain('apartamento');
    expect(options).toContain('casa_rural');
  });

  it('should have all transport options including empty option', () => {
    render(<TravelForm {...defaultProps} />);

    const transporteSelect = screen.getByLabelText(/transporte/i);
    const options = Array.from(transporteSelect.querySelectorAll('option')).map(option => option.value);

    expect(options).toContain('');
    expect(options).toContain('vuelo');
    expect(options).toContain('tren');
    expect(options).toContain('autobus');
    expect(options).toContain('coche');
  });

  it('should render form title', () => {
    render(<TravelForm {...defaultProps} />);

    expect(screen.getByText(/generador de planes de viaje/i)).toBeInTheDocument();
  });

  it('should have proper form accessibility', () => {
    render(<TravelForm {...defaultProps} />);

    // Check that all inputs have proper labels
    expect(screen.getByLabelText(/origen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destino/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/días/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de viaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presupuesto/i)).toBeInTheDocument();

    // Check that the form has proper structure
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('should handle form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<TravelForm {...defaultProps} />);

    // Fill required fields
    await user.type(screen.getByLabelText(/origen/i), 'Madrid');
    await user.type(screen.getByLabelText(/destino/i), 'Barcelona');

    // Press Enter in one of the inputs
    await user.type(screen.getByLabelText(/destino/i), '{enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});