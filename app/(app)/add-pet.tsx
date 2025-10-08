import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { usePets } from '../context/PetContext';

export default function AddPetScreen() {
  const { addPet } = usePets();
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petColor, setPetColor] = useState('');
  const [observations, setObservations] = useState('');
  const [selectedType, setSelectedType] = useState<'dog' | 'cat' | 'other' | null>(null);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePet = async () => {
    // Validação básica
    if (!petName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do pet');
      return;
    }

    if (!selectedType) {
      Alert.alert('Erro', 'Por favor, selecione o tipo do pet');
      return;
    }

    setIsLoading(true);

    try {
      const petData = {
        name: petName.trim(),
        type: selectedType,
        breed: petBreed.trim() || undefined,
        age: petAge.trim() || undefined,
        weight: petWeight.trim() || undefined,
        color: petColor.trim() || undefined,
        observations: observations.trim() || undefined,
        image: petImage,
        createdAt: new Date().toISOString(),
      };

      console.log('Salvando pet:', petData);

      // Salvar o pet usando o contexto
      await addPet(petData);
      
      Alert.alert(
        'Sucesso!',
        'Pet cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o pet. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (type: 'dog' | 'cat' | 'other') => {
    setSelectedType(type);
    setPetType(type === 'dog' ? 'Cachorro' : type === 'cat' ? 'Gato' : 'Outro');
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão da Câmera',
        'Precisamos de permissão para acessar a câmera para tirar fotos do seu pet.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Configurações', 
            onPress: () => {
              // Instrui o usuário a ir nas configurações
              Alert.alert(
                'Como permitir',
                'Vá em Configurações > Apps > MeuPet > Permissões e ative a Câmera'
              );
            }
          }
        ]
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão da Galeria',
        'Precisamos de permissão para acessar a galeria de fotos para selecionar fotos do seu pet.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Configurações', 
            onPress: () => {
              // Instrui o usuário a ir nas configurações
              Alert.alert(
                'Como permitir',
                'Vá em Configurações > Apps > MeuPet > Permissões e ative o acesso a Fotos'
              );
            }
          }
        ]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPetImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPetImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tirar Foto', 'Escolher da Galeria'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePicture();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Selecionar Foto',
        'Escolha uma opção:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Tirar Foto', onPress: takePicture },
          { text: 'Galeria', onPress: pickImageFromGallery },
        ]
      );
    }
  };

  const removePetImage = () => {
    Alert.alert(
      'Remover Foto',
      'Deseja remover a foto do pet?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => setPetImage(null), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Pet</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tipo de Pet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Pet</Text>
          <View style={styles.petTypeContainer}>
            <TouchableOpacity
              style={[
                styles.petTypeButton,
                selectedType === 'dog' && styles.petTypeButtonSelected,
              ]}
              onPress={() => handleTypeSelect('dog')}
            >
              <Text style={styles.petTypeEmoji}>🐕</Text>
              <Text
                style={[
                  styles.petTypeText,
                  selectedType === 'dog' && styles.petTypeTextSelected,
                ]}
              >
                Cachorro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.petTypeButton,
                selectedType === 'cat' && styles.petTypeButtonSelected,
              ]}
              onPress={() => handleTypeSelect('cat')}
            >
              <Text style={styles.petTypeEmoji}>🐱</Text>
              <Text
                style={[
                  styles.petTypeText,
                  selectedType === 'cat' && styles.petTypeTextSelected,
                ]}
              >
                Gato
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.petTypeButton,
                selectedType === 'other' && styles.petTypeButtonSelected,
              ]}
              onPress={() => handleTypeSelect('other')}
            >
              <Text style={styles.petTypeEmoji}>🐾</Text>
              <Text
                style={[
                  styles.petTypeText,
                  selectedType === 'other' && styles.petTypeTextSelected,
                ]}
              >
                Outro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Foto do Pet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto do Pet</Text>
          <View style={styles.imagePickerContainer}>
            {petImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: petImage }} style={styles.petImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removePetImage}
                >
                  <Ionicons name="close-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={showImagePicker}
                >
                  <Ionicons name="camera" size={16} color="#4A5FE7" />
                  <Text style={styles.changeImageText}>Alterar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={showImagePicker}
              >
                <Ionicons name="camera" size={32} color="#999" />
                <Text style={styles.imagePickerText}>Adicionar Foto</Text>
                <Text style={styles.imagePickerSubtext}>
                  Toque para tirar uma foto ou selecionar da galeria
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do pet"
              placeholderTextColor="#999"
              value={petName}
              onChangeText={setPetName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Raça</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a raça do pet"
              placeholderTextColor="#999"
              value={petBreed}
              onChangeText={setPetBreed}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Idade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 2 anos"
                placeholderTextColor="#999"
                value={petAge}
                onChangeText={setPetAge}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Peso</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 5 kg"
                placeholderTextColor="#999"
                value={petWeight}
                onChangeText={setPetWeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cor</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a cor predominante"
              placeholderTextColor="#999"
              value={petColor}
              onChangeText={setPetColor}
            />
          </View>
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações adicionais sobre o pet..."
              placeholderTextColor="#999"
              value={observations}
              onChangeText={setObservations}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSavePet}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Cadastrar Pet'}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
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
  headerPlaceholder: {
    width: 40,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  petTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  petTypeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E9EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  petTypeButtonSelected: {
    borderColor: '#4A5FE7',
    backgroundColor: '#F0F2FF',
  },
  petTypeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  petTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  petTypeTextSelected: {
    color: '#4A5FE7',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8E9EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  saveButton: {
    backgroundColor: '#4A5FE7',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4A5FE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
  imagePickerContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  imagePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8E9EB',
    borderStyle: 'dashed',
    minHeight: 150,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4A5FE7',
  },
  changeImageText: {
    fontSize: 12,
    color: '#4A5FE7',
    fontWeight: '600',
    marginLeft: 4,
  },
});
