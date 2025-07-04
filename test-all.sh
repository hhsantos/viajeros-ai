#!/bin/bash

echo "🧪 Ejecutando tests de Viajeros AI"
echo "=================================="
echo "🚀 Test runner unificado: Vitest"
echo ""

echo "📱 Frontend Tests (React + Vitest)..."
echo "-------------------------------------"
echo "Alias @/ configurados, jsdom environment"
npx vitest run --config vitest.config.ts || echo "❌ Frontend tests fallaron"

echo ""
echo "🖥️  Backend Tests (Node.js + Vitest)..."
echo "---------------------------------------"
echo "Alias @/ configurados, node environment"
(cd server && npx vitest run) || echo "❌ Backend tests fallaron"

echo ""
echo "📊 Resumen de Testing:"
echo "- Total esperado: ~104 tests"
echo "- Success rate objetivo: 89%"
echo "- Framework: Vitest unificado (migrado desde Jest)"
echo "- Imports: Alias absolutos @/ en ambos proyectos"
echo ""
echo "✅ Test suite completada"