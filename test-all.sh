#!/bin/bash

echo "🧪 Ejecutando tests de Viajeros AI"
echo "=================================="

echo ""
echo "📱 Frontend Tests (Vitest)..."
echo "------------------------------"
npm run test 2>/dev/null || echo "❌ Frontend tests fallaron"

echo ""
echo "🖥️  Backend Tests (Jest)..."
echo "----------------------------"
(cd server && npm test) 2>/dev/null || echo "❌ Backend tests fallaron"

echo ""
echo "✅ Tests completados"