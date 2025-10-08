import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface GroomingService {
  id: string;
  name: string;
  vicinity: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  services?: string[];
  phone?: string;
  promo?: string;
}

export default function GroomingServicesScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [groomingPlaces, setGroomingPlaces] = useState<GroomingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Chave da API do Google Places (você precisará obter uma chave válida)
  const GOOGLE_PLACES_API_KEY = 'SUA_CHAVE_DA_API_AQUI';

  useEffect(() => {
    getLocationAndGroomingServices();
  }, []);

  const getLocationAndGroomingServices = async () => {
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de Localização',
          'Precisamos da sua localização para encontrar serviços de banho e tosa próximos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurações', onPress: () => {
              Alert.alert('Como permitir', 'Vá em Configurações > Apps > MeuPet > Permissões e ative a Localização');
            }}
          ]
        );
        setLoading(false);
        return;
      }

      // Obter localização atual
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;
      
      // Atualizar região do mapa
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Buscar serviços de banho e tosa próximos
      await searchNearbyGroomingServices(latitude, longitude);
      
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Usando localização padrão.');
      
      // Usar localização padrão (São Paulo) e buscar serviços
      await searchNearbyGroomingServices(-23.550520, -46.633308);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyGroomingServices = async (lat: number, lng: number) => {
    try {
      // Simulação de serviços de banho e tosa próximos
      const mockGroomingServices: GroomingService[] = [
        {
          id: '1',
          name: 'Pet Beauty Salon',
          vicinity: 'Rua da Beleza Pet, 123',
          rating: 4.7,
          geometry: {
            location: {
              lat: lat + 0.01,
              lng: lng + 0.01,
            },
          },
          place_id: 'grooming_mock_1',
          types: ['pet_store', 'beauty_salon'],
          price_level: 3,
          opening_hours: {
            open_now: true,
          },
          services: ['Banho', 'Tosa', 'Hidratação', 'Perfume'],
          phone: '(11) 1234-5678',
          promo: '20% OFF',
        },
        {
          id: '2',
          name: 'Tosa & Spa Pet',
          vicinity: 'Av. dos Cuidados, 456',
          rating: 4.5,
          geometry: {
            location: {
              lat: lat - 0.015,
              lng: lng + 0.008,
            },
          },
          place_id: 'grooming_mock_2',
          types: ['pet_store', 'spa'],
          price_level: 4,
          opening_hours: {
            open_now: true,
          },
          services: ['Banho Relaxante', 'Tosa Artística', 'Spa', 'Aromaterapia'],
          phone: '(11) 2345-6789',
        },
        {
          id: '3',
          name: 'Quick Pet Grooming',
          vicinity: 'Shopping Pet Center, L1-08',
          rating: 4.3,
          geometry: {
            location: {
              lat: lat + 0.008,
              lng: lng - 0.012,
            },
          },
          place_id: 'grooming_mock_3',
          types: ['pet_store'],
          price_level: 2,
          opening_hours: {
            open_now: false,
          },
          services: ['Banho Rápido', 'Tosa Simples', 'Corte de Unhas'],
          phone: '(11) 3456-7890',
          promo: 'Express 30min',
        },
        {
          id: '4',
          name: 'Estética Animal Premium',
          vicinity: 'Rua do Luxo Pet, 789',
          rating: 4.9,
          geometry: {
            location: {
              lat: lat - 0.008,
              lng: lng - 0.01,
            },
          },
          place_id: 'grooming_mock_4',
          types: ['pet_store', 'beauty_salon'],
          price_level: 4,
          opening_hours: {
            open_now: true,
          },
          services: ['Tosa Show', 'Banho Premium', 'Tintura', 'Nail Art'],
          phone: '(11) 4567-8901',
        },
        {
          id: '5',
          name: 'Pet Wash Express',
          vicinity: 'Centro Automotivo, Anexo Pet',
          rating: 4.1,
          geometry: {
            location: {
              lat: lat + 0.02,
              lng: lng - 0.005,
            },
          },
          place_id: 'grooming_mock_5',
          types: ['pet_store'],
          price_level: 1,
          opening_hours: {
            open_now: true,
          },
          services: ['Self Service', 'Banho Simples', 'Secagem'],
          phone: '(11) 5678-9012',
          promo: 'Self R$ 15',
        },
      ];

      setGroomingPlaces(mockGroomingServices);

      // Em produção, você usaria algo assim:
      /*
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=pet+grooming+banho+tosa&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        setGroomingPlaces(data.results);
      }
      */
    } catch (error) {
      console.error('Erro ao buscar serviços de banho e tosa:', error);
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const getMarkerColor = (rating?: number) => {
    if (!rating) return '#FF6B6B';
    if (rating >= 4.5) return '#FF6B9D'; // Rosa para banho e tosa
    if (rating >= 4.0) return '#FFC107';
    return '#FF6B6B';
  };

  const handleCallGrooming = (phone?: string) => {
    if (phone) {
      Alert.alert(
        'Ligar para o Estabelecimento',
        `Deseja ligar para ${phone}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ligar', onPress: () => {
            // Em produção, você usaria: Linking.openURL(`tel:${phone}`)
            alert(`Ligando para ${phone}...`);
          }}
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Banho e Tosa</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={loading}
      >
        {groomingPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            pinColor={getMarkerColor(place.rating)}
          >
            <Callout style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text style={styles.calloutAddress}>{place.vicinity}</Text>
                
                {place.services && (
                  <Text style={styles.calloutServices}>
                    ✂️ {place.services.slice(0, 2).join(', ')}
                  </Text>
                )}
                
                <View style={styles.calloutInfo}>
                  {place.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{place.rating}</Text>
                    </View>
                  )}
                  
                  {place.price_level && (
                    <Text style={styles.priceText}>{getPriceLevel(place.price_level)}</Text>
                  )}
                  
                  {place.opening_hours && (
                    <View style={[
                      styles.statusContainer,
                      { backgroundColor: place.opening_hours.open_now ? '#FF6B9D' : '#F44336' }
                    ]}>
                      <Text style={styles.statusText}>
                        {place.opening_hours.open_now ? 'Aberto' : 'Fechado'}
                      </Text>
                    </View>
                  )}
                </View>

                {place.promo && (
                  <View style={styles.promoContainer}>
                    <Text style={styles.promoText}>🎉 {place.promo}</Text>
                  </View>
                )}

                {place.phone && (
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCallGrooming(place.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FF6B9D" />
                    <Text style={styles.callButtonText}>Ligar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.promoMainContainer}>
          <Ionicons name="cut" size={24} color="#fff" />
          <View style={styles.promoMainInfo}>
            <Text style={styles.promoMainTitle}>Promoção Especial</Text>
            <Text style={styles.promoMainSubtitle}>Banho + Tosa por R$ 45</Text>
          </View>
          <TouchableOpacity style={styles.promoMainButton}>
            <Text style={styles.promoMainButtonText}>USAR</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.serviceInfo}>
          <Ionicons name="time-outline" size={20} color="#FF6B9D" />
          <Text style={styles.serviceText}>Agendamento disponível</Text>
        </View>

        <Text style={styles.itemsTitle}>Serviços encontrados</Text>
        
        <View style={styles.itemsList}>
          {groomingPlaces.slice(0, 3).map((place) => (
            <View key={place.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{place.name}</Text>
                <Text style={styles.itemServices}>
                  {place.services ? place.services.slice(0, 2).join(' • ') : 'Banho e Tosa'}
                </Text>
              </View>
              <View style={styles.itemRating}>
                {place.rating && (
                  <>
                    <Text style={styles.itemRatingText}>{place.rating}★</Text>
                    {place.promo && (
                      <Text style={styles.itemPromo}>{place.promo}</Text>
                    )}
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="calendar" size={20} color="#FF6B9D" />
          <Text style={styles.addButtonText}>Agendar serviço</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 15,
    backgroundColor: '#FF6B9D',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerPlaceholder: {
    width: 40,
  },
  map: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 90 : 110,
  },
  callout: {
    width: 250,
  },
  calloutContainer: {
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  calloutServices: {
    fontSize: 12,
    color: '#FF6B9D',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  calloutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  promoContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  promoText: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: 'bold',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  callButtonText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  bottomPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  promoMainContainer: {
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoMainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  promoMainTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoMainSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  promoMainButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  promoMainButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceText: {
    fontSize: 16,
    color: '#FF6B9D',
    marginLeft: 8,
    fontWeight: '600',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemServices: {
    fontSize: 12,
    color: '#666',
  },
  itemRating: {
    alignItems: 'flex-end',
  },
  itemRatingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  itemPromo: {
    fontSize: 10,
    color: '#FF8F00',
    fontWeight: 'bold',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FCE4EC',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  addButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});