// Configurações da API do Google Places
// Para obter uma chave da API:
// 1. Acesse https://console.developers.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Ative a API "Places API" e "Maps SDK for Android/iOS"
// 4. Crie uma chave de API
// 5. Configure as restrições de segurança

export const GOOGLE_PLACES_API_KEY = 'SUA_CHAVE_DA_API_AQUI';

// Configurações padrão para buscas
export const SEARCH_CONFIG = {
  radius: 5000, // 5km de raio
  types: {
    petShops: 'pet_store',
    veterinarians: 'veterinary_care',
    petGrooming: 'pet_store',
    animalHospital: 'hospital',
  },
  language: 'pt-BR',
  region: 'br',
};

// Especialidades veterinárias comuns
export const VETERINARY_SPECIALTIES = [
  'Clínica Geral',
  'Emergência 24h',
  'Cirurgia',
  'Dermatologia',
  'Cardiologia',
  'Oftalmologia',
  'Ortopedia',
  'Oncologia',
  'Felinos',
  'Animais Exóticos',
  'Comportamento Animal',
];

// Localização padrão (São Paulo)
export const DEFAULT_LOCATION = {
  latitude: -23.550520,
  longitude: -46.633308,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};