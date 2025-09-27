#!/bin/bash

# Script para criar um usuário admin no Supabase para teste
echo "Criando dados de teste para o sistema administrativo..."

# Teste de conectividade com Supabase
SUPABASE_URL="https://nbegwhqnlafwkxcoppyk.supabase.co"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZWd3aHFubGFmd2t4Y29wcHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTg2MjUsImV4cCI6MjA3NDQ5NDYyNX0.vBinoo6UH9aBgEn_f4t0zP_ueEo5UUzzW1o122a2VPQ"

# Testar se as tabelas existem
echo "Verificando se as tabelas existem..."
curl -s -H "apikey: $API_KEY" -H "Authorization: Bearer $API_KEY" \
  "$SUPABASE_URL/rest/v1/users?limit=1" | head -c 100

echo ""
echo "Verificando comunidades..."
curl -s -H "apikey: $API_KEY" -H "Authorization: Bearer $API_KEY" \
  "$SUPABASE_URL/rest/v1/communities?limit=1" | head -c 100

echo ""
echo "Verificando agendamentos..."
curl -s -H "apikey: $API_KEY" -H "Authorization: Bearer $API_KEY" \
  "$SUPABASE_URL/rest/v1/appointments?limit=1" | head -c 100

echo ""
echo "Teste de conectividade concluído."