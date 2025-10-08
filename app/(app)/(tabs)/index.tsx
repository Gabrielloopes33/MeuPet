import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../../../components/Themed';
import { usePets } from '../../context/PetContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { pets, isLoading } = usePets();
  const [userName, setUserName] = useState('Usuário');
  const [searchText, setSearchText] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);

  // Função para obter o nome do usuário (pode ser de AsyncStorage, API, etc.)
  const getUserName = async () => {
    try {
      // OPÇÕES DE IMPLEMENTAÇÃO:
      
      // 1. AsyncStorage (dados locais):
      // import AsyncStorage from '@react-native-async-storage/async-storage';
      // const name = await AsyncStorage.getItem('userName');
      // if (name) setUserName(name);
      
      // 2. API/Backend:
      // const response = await api.get('/user/profile');
      // setUserName(response.data.name);
      
      // 3. Context/Estado global:
      // const { user } = useAuth();
      // setUserName(user?.name || 'Usuário');
      
      // Por enquanto, simulação - substitua pela lógica real conforme necessário
      setUserName('Caren');
    } catch (error) {
      console.log('Erro ao obter nome do usuário:', error);
      setUserName('Usuário');
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  const handleServicePress = (service: string) => {
    console.log(`Serviço selecionado: ${service}`);
    
    switch (service) {
      case 'Comida':
        router.push('/(app)/food-services');
        break;
      case 'Veterinário':
        router.push('/(app)/veterinary-services');
        break;
      case 'Banho e Tosa':
        router.push('/(app)/grooming-services');
        break;
      case 'Treinamento':
        // Futuramente, implementar tela de treinamento
        alert('Funcionalidade de treinamento será implementada em breve!');
        break;
      default:
        console.log('Serviço não implementado:', service);
    }
  };

  const handlePetPress = (petId: string) => {
    console.log(`Pet selecionado: ${petId}`);
    router.push({
      pathname: '/(app)/pet-details',
      params: { id: petId }
    });
  };

  const handleAddPet = () => {
    console.log('Adicionar novo pet');
    router.push('/(app)/add-pet');
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

  const calculateAge = (birthDate: string) => {
    try {
      const birth = new Date(birthDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} dias`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.floor((diffDays % 365) / 30);
        if (remainingMonths === 0) {
          return `${years} ${years === 1 ? 'ano' : 'anos'}`;
        }
        return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
      }
    } catch (error) {
      return 'Idade não informada';
    }
  };

  // Função utilitária para atualizar o nome do usuário quando necessário
  const updateUserName = (newName: string) => {
    setUserName(newName);
    // Opcionalmente, salvar no AsyncStorage também:
    // AsyncStorage.setItem('userName', newName);
  };

  // Dados dos banners
  const banners = [
    {
      id: 1,
      title: 'Desconto 30% no primeiro pedido!',
      subtitle: 'Rações premium para seu pet',
      backgroundColor: '#4A5FE7',
      emoji: '🐕',
      buttonText: 'Pedir agora',
      discount: '30% OFF',
    },
    {
      id: 2,
      title: 'Consulta veterinária em casa',
      subtitle: 'Agende uma consulta domiciliar',
      backgroundColor: '#FF6B6B',
      emoji: '🏥',
      buttonText: 'Agendar',
      discount: 'NOVO',
    },
    {
      id: 3,
      title: 'Banho e tosa com desconto',
      subtitle: 'Seu pet mais bonito e cheiroso',
      backgroundColor: '#FF6B9D',
      emoji: '✂️',
      buttonText: 'Reservar',
      discount: '20% OFF',
    },
    {
      id: 4,
      title: 'Hotel Pet para as férias',
      subtitle: 'Cuidados especiais enquanto você viaja',
      backgroundColor: '#4ECDC4',
      emoji: '🏨',
      buttonText: 'Reservar',
      discount: 'PROMOÇÃO',
    },
  ];

  // Auto scroll do banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        bannerScrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000); // Troca a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const handleBannerScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentBannerIndex(index);
  };

  return (
    <LinearGradient
      colors={['#F8F9FA', '#F0F8FF', '#E8F4FD']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
        hidden={false}
      />
      
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Olá, Gabriel! 👋</Text>
            <Text style={styles.subtitle}>Cuide melhor do seu amigo aqui</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#4A5FE7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <View style={styles.addButtonInner}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIconStyle} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos, serviços..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner Carrossel */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
            style={styles.bannerScrollView}
          >
            {banners.map((banner) => (
              <View
                key={banner.id}
                style={[styles.bannerCard, { backgroundColor: banner.backgroundColor }]}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerLeft}>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{banner.discount}</Text>
                    </View>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                      <Text style={styles.bannerButtonText}>{banner.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bannerRight}>
                    <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentBannerIndex ? '#fff' : 'rgba(255,255,255,0.4)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Serviços */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Comida')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.serviceEmoji}>🍽️</Text>
              </View>
              <Text style={styles.serviceText}>Comida</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Veterinário')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.serviceEmoji}>🏥</Text>
              </View>
              <Text style={styles.serviceText}>Veterinário</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Banho e Tosa')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#FF6B9D' }]}>
                <Text style={styles.serviceEmoji}>✂️</Text>
              </View>
              <Text style={styles.serviceText}>Banho e Tosa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Treinamento')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#9C27B0' }]}>
                <Text style={styles.serviceEmoji}>🎓</Text>
              </View>
              <Text style={styles.serviceText}>Treinamento</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meus Pets */}
        <View style={styles.petsSection}>
          <View style={styles.petsSectionHeader}>
            <Text style={styles.sectionTitle}>Meus Pets</Text>
            <TouchableOpacity 
              style={styles.addPetButton}
              onPress={handleAddPet}
            >
              <Text style={styles.addPetIcon}>+</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.petsScrollView}
            contentContainerStyle={pets.length === 0 ? styles.emptyPetsContainer : undefined}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando pets...</Text>
              </View>
            ) : pets.length === 0 ? (
              <View style={styles.emptyPetsMessage}>
                <Text style={styles.emptyPetsEmoji}>�</Text>
                <Text style={styles.emptyPetsText}>Nenhum pet cadastrado</Text>
                <Text style={styles.emptyPetsSubtext}>Toque no + para adicionar seu primeiro pet</Text>
              </View>
            ) : (
              pets.map((pet) => (
                <TouchableOpacity 
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => handlePetPress(pet.id)}
                >
                  <View style={styles.petImageContainer}>
                    {pet.image ? (
                      <Image 
                        source={{ uri: pet.image }} 
                        style={styles.petImagePhoto}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.petImagePlaceholder}>
                        <Text style={styles.petImageEmoji}>{getPetEmoji(pet.type)}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petAge}>{pet.age || 'Idade não informada'}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço extra para a navbar
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50, // Ajustado para status bar
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    backgroundColor: 'transparent',
  },
  addButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A5FE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A5FE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  // Barra de Pesquisa
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconStyle: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 18,
    color: '#999',
  },
  // Banner Carrossel
  bannerContainer: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  bannerScrollView: {
    backgroundColor: 'transparent',
  },
  bannerCard: {
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 0,
  },
  bannerLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bannerRight: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerEmoji: {
    fontSize: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    backgroundColor: '',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  // Serviços
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  serviceItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  serviceIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceEmoji: {
    fontSize: 28,
    color: '#fff',
  },
  serviceText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Pets
  petsSection: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  petsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  addPetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A5FE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPetIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  petsScrollView: {
    backgroundColor: 'transparent',
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImageContainer: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  petImagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#F0F1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImageEmoji: {
    fontSize: 40,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petAge: {
    fontSize: 12,
    color: '#666',
  },
  // Estilos para estados vazio e loading
  emptyPetsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: width - 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: width - 40,
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyPetsMessage: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 40,
  },
  emptyPetsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyPetsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyPetsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  petImagePhoto: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
});
