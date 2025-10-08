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

interface Veterinarian {
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
  specialty?: string;
  phone?: string;
}

export default function VeterinaryServicesScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
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
    getLocationAndVeterinarians();
  }, []);

  const getLocationAndVeterinarians = async () => {
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de Localização',
          'Precisamos da sua localização para encontrar veterinários próximos.',
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

      // Buscar veterinários próximos
      await searchNearbyVeterinarians(latitude, longitude);
      
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Usando localização padrão.');
      
      // Usar localização padrão (São Paulo) e buscar veterinários
      await searchNearbyVeterinarians(-23.550520, -46.633308);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyVeterinarians = async (lat: number, lng: number) => {
    try {
      // Simulação de veterinários próximos (em produção, você usaria a API do Google Places)
      const mockVeterinarians: Veterinarian[] = [
        {
          id: '1',
          name: 'Clínica Veterinária VitaPet',
          vicinity: 'Rua dos Veterinários, 123',
          rating: 4.8,
          geometry: {
            location: {
              lat: lat + 0.01,
              lng: lng + 0.01,
            },
          },
          place_id: 'vet_mock_1',
          types: ['veterinary_care'],
          price_level: 3,
          opening_hours: {
            open_now: true,
          },
          specialty: 'Clínica Geral',
          phone: '(11) 1234-5678',
        },
        {
          id: '2',
          name: 'Hospital Veterinário 24h',
          vicinity: 'Av. dos Animais, 456',
          rating: 4.6,
          geometry: {
            location: {
              lat: lat - 0.015,
              lng: lng + 0.008,
            },
          },
          place_id: 'vet_mock_2',
          types: ['veterinary_care', 'hospital'],
          price_level: 4,
          opening_hours: {
            open_now: true,
          },
          specialty: 'Emergência 24h',
          phone: '(11) 2345-6789',
        },
        {
          id: '3',
          name: 'Dr. Silva - Especialista em Felinos',
          vicinity: 'Centro Médico Pet, Sala 203',
          rating: 4.9,
          geometry: {
            location: {
              lat: lat + 0.008,
              lng: lng - 0.012,
            },
          },
          place_id: 'vet_mock_3',
          types: ['veterinary_care'],
          price_level: 3,
          opening_hours: {
            open_now: false,
          },
          specialty: 'Felinos',
          phone: '(11) 3456-7890',
        },
        {
          id: '4',
          name: 'PetCare Clínica Veterinária',
          vicinity: 'Rua da Saúde Animal, 789',
          rating: 4.4,
          geometry: {
            location: {
              lat: lat - 0.008,
              lng: lng - 0.01,
            },
          },
          place_id: 'vet_mock_4',
          types: ['veterinary_care'],
          price_level: 2,
          opening_hours: {
            open_now: true,
          },
          specialty: 'Cirurgia',
          phone: '(11) 4567-8901',
        },
        {
          id: '5',
          name: 'VetExpress - Consultas Rápidas',
          vicinity: 'Shopping Pet Center, L2-15',
          rating: 4.2,
          geometry: {
            location: {
              lat: lat + 0.02,
              lng: lng - 0.005,
            },
          },
          place_id: 'vet_mock_5',
          types: ['veterinary_care'],
          price_level: 2,
          opening_hours: {
            open_now: true,
          },
          specialty: 'Consultas',
          phone: '(11) 5678-9012',
        },
      ];

      setVeterinarians(mockVeterinarians);

      // Em produção, você usaria algo assim:
      /*
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        setVeterinarians(data.results);
      }
      */
    } catch (error) {
      console.error('Erro ao buscar veterinários:', error);
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const getMarkerColor = (rating?: number) => {
    if (!rating) return '#FF6B6B';
    if (rating >= 4.5) return '#2196F3'; // Azul para veterinários
    if (rating >= 4.0) return '#FFC107';
    return '#FF6B6B';
  };

  const handleCallVeterinarian = (phone?: string) => {
    if (phone) {
      Alert.alert(
        'Ligar para o Veterinário',
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
        <Text style={styles.headerTitle}>Veterinários Próximos</Text>
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
        {veterinarians.map((vet) => (
          <Marker
            key={vet.id}
            coordinate={{
              latitude: vet.geometry.location.lat,
              longitude: vet.geometry.location.lng,
            }}
            pinColor={getMarkerColor(vet.rating)}
          >
            <Callout style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{vet.name}</Text>
                <Text style={styles.calloutAddress}>{vet.vicinity}</Text>
                
                {vet.specialty && (
                  <Text style={styles.calloutSpecialty}>📋 {vet.specialty}</Text>
                )}
                
                <View style={styles.calloutInfo}>
                  {vet.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{vet.rating}</Text>
                    </View>
                  )}
                  
                  {vet.price_level && (
                    <Text style={styles.priceText}>{getPriceLevel(vet.price_level)}</Text>
                  )}
                  
                  {vet.opening_hours && (
                    <View style={[
                      styles.statusContainer,
                      { backgroundColor: vet.opening_hours.open_now ? '#2196F3' : '#F44336' }
                    ]}>
                      <Text style={styles.statusText}>
                        {vet.opening_hours.open_now ? 'Aberto' : 'Fechado'}
                      </Text>
                    </View>
                  )}
                </View>

                {vet.phone && (
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCallVeterinarian(vet.phone)}
                  >
                    <Ionicons name="call" size={16} color="#2196F3" />
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
        <View style={styles.emergencyContainer}>
          <Ionicons name="medical" size={24} color="#fff" />
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyTitle}>Emergência Veterinária</Text>
            <Text style={styles.emergencySubtitle}>24h disponível</Text>
          </View>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appointmentInfo}>
          <Ionicons name="calendar-outline" size={20} color="#2196F3" />
          <Text style={styles.appointmentText}>Agendamento disponível</Text>
        </View>

        <Text style={styles.itemsTitle}>Veterinários encontrados</Text>
        
        <View style={styles.itemsList}>
          {veterinarians.slice(0, 3).map((vet) => (
            <View key={vet.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{vet.name}</Text>
                <Text style={styles.itemSpecialty}>{vet.specialty}</Text>
              </View>
              <View style={styles.itemRating}>
                {vet.rating && (
                  <>
                    <Text style={styles.itemRatingText}>{vet.rating}★</Text>
                    <Text style={styles.itemDistance}>2.5 km</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="calendar" size={20} color="#2196F3" />
          <Text style={styles.addButtonText}>Agendar consulta</Text>
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
    backgroundColor: '#2196F3',
    position: 'absolute',
    top: 35,
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
  calloutSpecialty: {
    fontSize: 12,
    color: '#2196F3',
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
    color: '#2196F3',
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
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  callButtonText: {
    color: '#2196F3',
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
  emergencyContainer: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencySubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  emergencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appointmentText: {
    fontSize: 16,
    color: '#2196F3',
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
  itemSpecialty: {
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
  itemDistance: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  addButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});