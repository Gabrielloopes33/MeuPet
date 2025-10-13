import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddAppointmentModal from '../../../components/AddAppointmentModal';
import { useAppointment } from '../../context/AppointmentContext';

export default function AgendaScreen() {
  const { appointments, getAppointmentsByDate } = useAppointment();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  // Função para gerar os dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isSelected = 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
      });
    }
    
    return days;
  };

  // Função para navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Função para selecionar uma data
  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Obter agendamentos do dia selecionado
  const todaysAppointments = getAppointmentsByDate(selectedDate);

  // Formatação de mês e ano
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'Wed', 'Th', 'Fr', 'Sa', 'Su'];

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.monthYearContainer}>
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <Ionicons name="chevron-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitial}>G</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          {/* Dias da semana */}
          <View style={styles.weekDaysContainer}>
            {dayNames.map((day) => (
              <View key={day} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Dias do calendário */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((dayInfo, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  !dayInfo.isCurrentMonth && styles.calendarDayInactive,
                  dayInfo.isToday && styles.calendarDayToday,
                  dayInfo.isSelected && styles.calendarDaySelected,
                ]}
                onPress={() => selectDate(dayInfo.date)}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    !dayInfo.isCurrentMonth && styles.calendarDayTextInactive,
                    dayInfo.isToday && styles.calendarDayTextToday,
                    dayInfo.isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {dayInfo.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timeline dos agendamentos */}
        <View style={styles.timeline}>
          {/* Horários e agendamentos */}
          <View style={styles.timelineContent}>
            {/* Linha de horário 09:00 */}
            <View style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>09:00</Text>
              </View>
              <View style={styles.timelineEvents}>
                {/* Espaço vazio */}
              </View>
            </View>

            {/* Linha de horário 10:00 */}
            <View style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>10:00</Text>
              </View>
              <View style={styles.timelineEvents}>
                {todaysAppointments
                  .filter(apt => apt.startTime.startsWith('10:'))
                  .map((appointment) => (
                    <TouchableOpacity
                      key={appointment.id}
                      style={[
                        styles.appointmentCard,
                        { backgroundColor: appointment.color || '#87CEEB' }
                      ]}
                      onPress={() => Alert.alert('Agendamento', appointment.title)}
                    >
                      <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                      <Text style={styles.appointmentTime}>
                        {appointment.startTime} - {appointment.endTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {/* Linha de horário 11:00 */}
            <View style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>11:00</Text>
              </View>
              <View style={styles.timelineEvents}>
                {todaysAppointments
                  .filter(apt => apt.startTime.startsWith('11:'))
                  .map((appointment) => (
                    <TouchableOpacity
                      key={appointment.id}
                      style={[
                        styles.appointmentCard,
                        { backgroundColor: appointment.color || '#98FB98' }
                      ]}
                      onPress={() => Alert.alert('Agendamento', appointment.title)}
                    >
                      <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                      <Text style={styles.appointmentTime}>
                        {appointment.startTime} - {appointment.endTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {/* Linha de horário 12:00 */}
            <View style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>12:00</Text>
              </View>
              <View style={styles.timelineEvents}>
                {/* Espaço vazio */}
              </View>
            </View>

            {/* Linha de horário 13:00 */}
            <View style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>13:00</Text>
              </View>
              <View style={styles.timelineEvents}>
                {/* Espaço vazio */}
              </View>
            </View>
          </View>
        </View>

        {/* Botão de adicionar */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de adicionar agendamento */}
      <AddAppointmentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A5FE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendar: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDayInactive: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: '#333',
    borderRadius: 20,
  },
  calendarDaySelected: {
    backgroundColor: '#4A5FE7',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  calendarDayTextInactive: {
    color: '#ccc',
  },
  calendarDayTextToday: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeline: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timelineContent: {
    flex: 1,
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeLabel: {
    width: 60,
    paddingTop: 10,
    paddingRight: 15,
  },
  timeLabelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timelineEvents: {
    flex: 1,
    paddingVertical: 5,
  },
  appointmentCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 200,
    right: 30,
    width: 96,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
});
