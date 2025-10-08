import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from '../../components/Themed';
import { usePets } from '../context/PetContext';

const { width } = Dimensions.get('window');

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPetById } = usePets();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const pet = getPetById(id || '');

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pet não encontrado</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getPetTypeText = (type: string) => {
    switch (type) {
      case 'dog':
        return 'Cachorro';
      case 'cat':
        return 'Gato';
      default:
        return 'Outro';
    }
  };

  const getPetEmoji = (type: string) => {
    switch (type) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      default:
        return '🐾';
    }
  };

  const getGenderIcon = (): keyof typeof Ionicons.glyphMap => {
    // Por enquanto, vamos usar um ícone genérico
    // Você pode adicionar um campo de gênero no futuro
    return 'paw-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          {pet.image ? (
            <Image 
              source={{ uri: pet.image }} 
              style={styles.petImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <Text style={styles.petImageEmoji}>{getPetEmoji(pet.type)}</Text>
            </View>
          )}
          
          {/* Image indicators - could be used for multiple images in the future */}
          <View style={styles.imageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Pet Info */}
        <View style={styles.petInfoContainer}>
          <View style={styles.petNameRow}>
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>São Paulo, BR</Text>
          </View>

          {/* Pet Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name={getGenderIcon()} size={24} color="#666" />
              <Text style={styles.statLabel}>Tipo</Text>
              <Text style={styles.statValue}>{getPetTypeText(pet.type)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Idade</Text>
              <Text style={styles.statValue}>{pet.age || 'N/A'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Peso</Text>
              <Text style={styles.statValue}>{pet.weight || 'N/A'}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {pet.observations || `Conheça ${pet.name}, um ${getPetTypeText(pet.type).toLowerCase()} adorável com uma personalidade curiosa e brincalhona. ${pet.breed ? `Da raça ${pet.breed}, ` : ''}${pet.color ? `com pelagem ${pet.color.toLowerCase()}, ` : ''}tem olhos brilhantes que conquistam o coração de todos, e adora explorar o mundo ao seu redor.`}
            </Text>
          </View>

          {/* Additional Info */}
          {(pet.breed || pet.color) && (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.sectionTitle}>Informações Adicionais</Text>
              
              {pet.breed && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Raça:</Text>
                  <Text style={styles.infoValue}>{pet.breed}</Text>
                </View>
              )}
              
              {pet.color && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cor:</Text>
                  <Text style={styles.infoValue}>{pet.color}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cadastrado em:</Text>
                <Text style={styles.infoValue}>
                  {new Date(pet.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Futuramente, você pode implementar uma tela de edição
              // Por enquanto, vamos mostrar um alert
              alert('Funcionalidade de edição será implementada em breve!');
            }}
          >
            <Text style={styles.actionButtonText}>Editar Pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: 'transparent',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    borderRadius: 20,
    height: 300,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  petImageEmoji: {
    fontSize: 80,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  petInfoContainer: {
    paddingHorizontal: 20,
  },
  petNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  petPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A5FE7',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
  additionalInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4A5FE7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});