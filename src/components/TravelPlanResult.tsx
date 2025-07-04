import React from 'react';
import type { TravelPlanResponse } from '../types/travel';

interface TravelPlanResultProps {
  result: TravelPlanResponse;
  onReset: () => void;
}

const TravelPlanResult: React.FC<TravelPlanResultProps> = ({ result, onReset }) => {
  // Convertir markdown a HTML básico (implementación simple)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-800 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-700 mb-2 mt-4">$1</h3>')
      .replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^([0-9]+\.) (.*$)/gm, '<li class="ml-4 mb-1">$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Tu Plan de Viaje
          </h2>
          <button
            onClick={onReset}
            className="btn-secondary"
          >
            Crear Nuevo Plan
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Ruta:</span>
              <p className="text-gray-800">{result.metadata.parametros.origen} → {result.metadata.parametros.destino}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Duración:</span>
              <p className="text-gray-800">{result.metadata.parametros.dias} días</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tipo:</span>
              <p className="text-gray-800 capitalize">{result.metadata.parametros.tipoViaje}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4">${formatContent(result.plan)}</p>` 
            }}
          />
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Generado por {result.metadata.aiProvider} • {new Date(result.metadata.generatedAt).toLocaleString()}
            </span>
            <span>ID: {result.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanResult;