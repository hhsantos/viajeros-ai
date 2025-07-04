import React, { useState } from 'react';
import type { TravelPlanRequest } from '@/types/travel';

interface TravelFormProps {
  onSubmit: (request: TravelPlanRequest) => void;
  loading: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<TravelPlanRequest>({
    origen: '',
    destino: '',
    dias: 7,
    tipoViaje: 'familia',
    presupuesto: 'medio',
    alojamiento: undefined,
    transporte: undefined,
    actividades: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dias' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🌍 Generador de Planes de Viaje
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origen" className="block text-sm font-medium text-gray-700 mb-2">
              Origen
            </label>
            <input
              type="text"
              id="origen"
              name="origen"
              value={formData.origen}
              onChange={handleChange}
              className="form-input"
              placeholder="Madrid, España"
              required
            />
          </div>
          
          <div>
            <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-2">
              Destino
            </label>
            <input
              type="text"
              id="destino"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              className="form-input"
              placeholder="París, Francia"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dias" className="block text-sm font-medium text-gray-700 mb-2">
              Días
            </label>
            <input
              type="number"
              id="dias"
              name="dias"
              value={formData.dias}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="365"
              required
            />
          </div>
          
          <div>
            <label htmlFor="tipoViaje" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Viaje
            </label>
            <select
              id="tipoViaje"
              name="tipoViaje"
              value={formData.tipoViaje}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="familia">Familia</option>
              <option value="mochilero">Mochilero</option>
              <option value="lujo">Lujo</option>
              <option value="aventura">Aventura</option>
              <option value="cultural">Cultural</option>
              <option value="gastronomico">Gastronómico</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="presupuesto" className="block text-sm font-medium text-gray-700 mb-2">
              Presupuesto
            </label>
            <select
              id="presupuesto"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="alojamiento" className="block text-sm font-medium text-gray-700 mb-2">
              Alojamiento (opcional)
            </label>
            <select
              id="alojamiento"
              name="alojamiento"
              value={formData.alojamiento || ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Cualquiera</option>
              <option value="hotel">Hotel</option>
              <option value="hostal">Hostal</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa_rural">Casa Rural</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="transporte" className="block text-sm font-medium text-gray-700 mb-2">
              Transporte (opcional)
            </label>
            <select
              id="transporte"
              name="transporte"
              value={formData.transporte || ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Cualquiera</option>
              <option value="vuelo">Vuelo</option>
              <option value="tren">Tren</option>
              <option value="autobus">Autobús</option>
              <option value="coche">Coche</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando plan...
              </span>
            ) : (
              'Generar Plan de Viaje'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelForm;