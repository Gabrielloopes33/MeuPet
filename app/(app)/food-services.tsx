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

interface Place {
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
}

export default function FoodServicesScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
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
    getLocationAndPlaces();
  }, []);

  const getLocationAndPlaces = async () => {
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de Localização',
          'Precisamos da sua localização para encontrar pet shops próximos.',
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

      // Buscar pet shops próximos
      await searchNearbyPetShops(latitude, longitude);
      
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Usando localização padrão.');
      
      // Usar localização padrão (São Paulo) e buscar places
      await searchNearbyPetShops(-23.550520, -46.633308);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyPetShops = async (lat: number, lng: number) => {
    try {
      // Simulação de lugares próximos (em produção, você usaria a API do Google Places)
      // Para demonstração, vou criar alguns lugares fictícios
      const mockPlaces: Place[] = [
        {
          id: '1',
          name: 'Pet Shop Central',
          vicinity: 'Rua das Flores, 123',
          rating: 4.5,
          geometry: {
            location: {
              lat: lat + 0.01,
              lng: lng + 0.01,
            },
          },
          place_id: 'mock_1',
          types: ['pet_store'],
          price_level: 2,
          opening_hours: {
            open_now: true,
          },
        },
        {
          id: '2',
          name: 'Ração & Cia',
          vicinity: 'Av. Principal, 456',
          rating: 4.2,
          geometry: {
            location: {
              lat: lat - 0.015,
              lng: lng + 0.008,
            },
          },
          place_id: 'mock_2',
          types: ['pet_store', 'store'],
          price_level: 1,
          opening_hours: {
            open_now: true,
          },
        },
        {
          id: '3',
          name: 'Depot Pet',
          vicinity: 'Shopping Pet, Loja 69',
          rating: 4.8,
          geometry: {
            location: {
              lat: lat + 0.008,
              lng: lng - 0.012,
            },
          },
          place_id: 'mock_3',
          types: ['pet_store'],
          price_level: 3,
          opening_hours: {
            open_now: false,
          },
        },
        {
          id: '4',
          name: 'PetLand Superstore',
          vicinity: 'Rua dos Animais, 789',
          rating: 4.0,
          geometry: {
            location: {
              lat: lat - 0.008,
              lng: lng - 0.01,
            },
          },
          place_id: 'mock_4',
          types: ['pet_store', 'veterinary_care'],
          price_level: 2,
          opening_hours: {
            open_now: true,
          },
        },
        {
          id: '5',
          name: 'Mundo Pet',
          vicinity: 'Centro Comercial, Bl. A',
          rating: 3.8,
          geometry: {
            location: {
              lat: lat + 0.02,
              lng: lng - 0.005,
            },
          },
          place_id: 'mock_5',
          types: ['pet_store'],
          price_level: 1,
          opening_hours: {
            open_now: true,
          },
        },
      ];

      setPlaces(mockPlaces);

      // Em produção, você usaria algo assim:
      /*
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=pet_store&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        setPlaces(data.results);
      }
      */
    } catch (error) {
      console.error('Erro ao buscar pet shops:', error);
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const getMarkerColor = (rating?: number) => {
    if (!rating) return '#FF6B6B';
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 4.0) return '#FFC107';
    return '#FF6B6B';
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
        <Text style={styles.headerTitle}>Pet Shops Próximos</Text>
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
        {places.map((place) => (
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
                      { backgroundColor: place.opening_hours.open_now ? '#1A5074' : '#1A5074' }
                    ]}>
                      <Text style={styles.statusText}>
                        {place.opening_hours.open_now ? 'Aberto' : 'Fechado'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.couponContainer}>
          <Text style={styles.couponTitle}>Cupom de desconto</Text>
          <Text style={styles.couponCode}>MEUPET10</Text>
        </View>
        
        <View style={styles.deliveryInfo}>
          <Ionicons name="time-outline" size={20} color="#4CAF50" />
          <Text style={styles.deliveryText}>Entrega em 30 minutos</Text>
        </View>

        <Text style={styles.itemsTitle}>Lojas encontradas</Text>
        
        <View style={styles.itemsList}>
          {places.slice(0, 3).map((place, index) => (
            <View key={place.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{place.name}</Text>
              <View style={styles.itemInfo}>
                {place.rating && (
                  <>
                    <Text style={styles.itemQuantity}>{place.rating}★</Text>
                    <Text style={styles.itemPrice}>{place.vicinity}</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#4CAF50" />
          <Text style={styles.addButtonText}>Ver todas as lojas</Text>
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
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 15,
    backgroundColor: '#1A5074',
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
    marginTop: Platform.OS === 'ios' ? 80 : 100,
  },
  callout: {
    width: 200,
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
    marginBottom: 8,
  },
  calloutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#4CAF50',
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
  couponContainer: {
    backgroundColor: '#1A5074',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  couponCode: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryText: {
    fontSize: 16,
    color: '#1A5074',
    marginLeft: 8,
    fontWeight: '600',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5074',
    marginBottom: 15,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 10,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
    width: 100,
    textAlign: 'right',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A5074',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#1A5074',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});