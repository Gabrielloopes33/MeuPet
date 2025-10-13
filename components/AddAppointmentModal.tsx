import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppointment } from '../app/context/AppointmentContext';
import { usePets } from '../app/context/PetContext';
import { Pet } from '../types/pet';

interface AddAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export default function AddAppointmentModal({ 
  visible, 
  onClose, 
  selectedDate = new Date() 
}: AddAppointmentModalProps) {
  const { addAppointment } = useAppointment();
  const { pets } = usePets();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'veterinary' | 'grooming' | 'consultation' | 'checkup' | 'vaccination' | 'other'>('consultation');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const appointmentTypes = [
    { id: 'consultation', label: 'Consulta', color: '#87CEEB', icon: 'medical' },
    { id: 'veterinary', label: 'Veterinário', color: '#2196F3', icon: 'medical-outline' },
    { id: 'grooming', label: 'Estética', color: '#DDA0DD', icon: 'cut' },
    { id: 'checkup', label: 'Check-up', color: '#98FB98', icon: 'checkmark-circle' },
    { id: 'vaccination', label: 'Vacinação', color: '#FFB74D', icon: 'shield-checkmark' },
    { id: 'other', label: 'Outros', color: '#B0BEC5', icon: 'ellipsis-horizontal' },
  ];

  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para o agendamento.');
      return;
    }

    try {
      setIsLoading(true);
      
      const selectedPet = pets.find((p: Pet) => p.id === selectedPetId);
      const selectedType = appointmentTypes.find(t => t.id === type);
      
      await addAppointment({
        title,
        type,
        petId: selectedPetId || undefined,
        petName: selectedPet?.name || undefined,
        date,
        startTime,
        endTime,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'scheduled',
        color: selectedType?.color || '#87CEEB',
      });

      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      onClose();
      resetForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o agendamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('consultation');
    setSelectedPetId('');
    setDate(selectedDate);
    setStartTime('10:00');
    setEndTime('10:30');
    setLocation('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Agendamento</Text>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={isLoading}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          >
            <Text style={[styles.saveButtonText, isLoading && styles.saveButtonTextDisabled]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Consulta de rotina"
              placeholderTextColor="#999"
            />
          </View>

          {/* Tipo de agendamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de Agendamento</Text>
            <View style={styles.typeGrid}>
              {appointmentTypes.map((appointmentType) => (
                <TouchableOpacity
                  key={appointmentType.id}
                  style={[
                    styles.typeButton,
                    type === appointmentType.id && styles.typeButtonSelected,
                  ]}
                  onPress={() => setType(appointmentType.id as any)}
                >
                  <Ionicons 
                    name={appointmentType.icon as any} 
                    size={20} 
                    color={type === appointmentType.id ? '#fff' : appointmentType.color} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    type === appointmentType.id && styles.typeButtonTextSelected
                  ]}>
                    {appointmentType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pet (opcional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet (Opcional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.petOption,
                  selectedPetId === '' && styles.petOptionSelected
                ]}
                onPress={() => setSelectedPetId('')}
              >
                <Text style={[
                  styles.petOptionText,
                  selectedPetId === '' && styles.petOptionTextSelected
                ]}>
                  Nenhum
                </Text>
              </TouchableOpacity>
              {pets.map((pet: Pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petOption,
                    selectedPetId === pet.id && styles.petOptionSelected
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text style={[
                    styles.petOptionText,
                    selectedPetId === pet.id && styles.petOptionTextSelected
                  ]}>
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#4A5FE7" />
              <Text style={styles.dateButtonText}>
                {date.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horário */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horário</Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Início</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Text style={styles.timeButtonText}>{startTime}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Fim</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Text style={styles.timeButtonText}>{endTime}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Local */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Local (Opcional)</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Clínica Veterinária Pet Care"
              placeholderTextColor="#999"
            />
          </View>

          {/* Observações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações (Opcional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Observações adicionais..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4A5FE7',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    minHeight: 100,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    minWidth: 120,
  },
  typeButtonSelected: {
    backgroundColor: '#4A5FE7',
    borderColor: '#4A5FE7',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  petOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  petOptionSelected: {
    backgroundColor: '#4A5FE7',
    borderColor: '#4A5FE7',
  },
  petOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  petOptionTextSelected: {
    color: '#fff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  dateButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});