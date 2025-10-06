import { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Text, View } from '../../../components/Themed';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [userName, setUserName] = useState('Usuário');

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
    // Implementar navegação para cada serviço
  };

  const handlePetPress = (petName: string) => {
    console.log(`Pet selecionado: ${petName}`);
    // Implementar navegação para detalhes do pet
  };

  const handleAddPet = () => {
    console.log('Adicionar novo pet');
    // Implementar navegação para adicionar pet
  };

  // Função utilitária para atualizar o nome do usuário quando necessário
  const updateUserName = (newName: string) => {
    setUserName(newName);
    // Opcionalmente, salvar no AsyncStorage também:
    // AsyncStorage.setItem('userName', newName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#F8F9FA" 
        translucent={false}
        hidden={false}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Bom dia, Gabriel!</Text>
            <Text style={styles.subtitle}>vamos cuidar dos seus pets fofos.</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Consulta */}
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentTitle}>Consulta de Saúde para Freddy</Text>
            <View style={styles.pawIcon}>
              <Text style={styles.pawEmoji}>🐾</Text>
            </View>
          </View>
          
          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentIcon}>📅</Text>
              <Text style={styles.appointmentText}>Hoje às 11:30</Text>
            </View>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentIcon}>👨‍⚕️</Text>
              <Text style={styles.appointmentText}>Dr. Pendelenton</Text>
            </View>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentIcon}>📍</Text>
              <Text style={styles.appointmentText}>1 Geary Blvd, SF</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.directionButton}>
            <Text style={styles.directionButtonText}>Ver Direções</Text>
          </TouchableOpacity>
        </View>

        {/* Serviços */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Comida')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#FFE4E4' }]}>
                <Text style={styles.serviceEmoji}>🍽️</Text>
              </View>
              <Text style={styles.serviceText}>Comida</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Veterinário')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#E4F0FF' }]}>
                <Text style={styles.serviceEmoji}>🏥</Text>
              </View>
              <Text style={styles.serviceText}>Veterinário</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Banho e Tosa')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#FFE4F0' }]}>
                <Text style={styles.serviceEmoji}>✂️</Text>
              </View>
              <Text style={styles.serviceText}>Banho e Tosa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem}
              onPress={() => handleServicePress('Treinamento')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: '#F0E4FF' }]}>
                <Text style={styles.serviceEmoji}>💙</Text>
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
          >
            <TouchableOpacity 
              style={styles.petCard}
              onPress={() => handlePetPress('Freddy')}
            >
              <View style={styles.petImageContainer}>
                <View style={styles.petImagePlaceholder}>
                  <Text style={styles.petImageEmoji}>🐕</Text>
                </View>
              </View>
              <Text style={styles.petName}>Freddy</Text>
              <Text style={styles.petAge}>1 ano e 6 meses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.petCard}
              onPress={() => handlePetPress('Minni')}
            >
              <View style={styles.petImageContainer}>
                <View style={styles.petImagePlaceholder}>
                  <Text style={styles.petImageEmoji}>🐱</Text>
                </View>
              </View>
              <Text style={styles.petName}>Minni</Text>
              <Text style={styles.petAge}>5 meses</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 0, // Remove o padding extra
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20, // Padding padrão
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E9EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  // Card de Consulta
  appointmentCard: {
    backgroundColor: '#4A5FE7',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#4A5FE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  pawIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawEmoji: {
    fontSize: 16,
  },
  appointmentDetails: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  appointmentIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  appointmentText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  directionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  directionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
});
