import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appointment, AppointmentContextType } from '../../types/appointment';

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment deve ser usado dentro de um AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados iniciais
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      title: 'Control Consultation - Diego Perez',
      type: 'consultation',
      petName: 'Max',
      date: new Date('2024-10-31T10:30:00'),
      startTime: '10:30',
      endTime: '11:00',
      location: 'Clínica Veterinária Pet Care',
      status: 'scheduled',
      color: '#87CEEB',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Lunch - Break',
      type: 'other',
      date: new Date('2024-10-31T11:00:00'),
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      color: '#98FB98',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Botox - Lisa Cooper',
      type: 'grooming',
      petName: 'Luna',
      date: new Date('2024-10-31T11:30:00'),
      startTime: '11:30',
      endTime: '12:00',
      location: 'Pet Spa Luxo',
      status: 'scheduled',
      color: '#DDA0DD',
      createdAt: new Date(),
    },
  ];

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      
      // Tentar carregar do AsyncStorage primeiro
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments).map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
        }));
        setAppointments(parsedAppointments);
      } else {
        // Se não houver dados locais, usar dados mockados
        setAppointments(mockAppointments);
        await AsyncStorage.setItem('appointments', JSON.stringify(mockAppointments));
      }

      // Em produção, você faria algo assim:
      // const response = await api.get('/appointments');
      // setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAppointments(mockAppointments);
    } finally {
      setIsLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Em produção:
      // const response = await api.post('/appointments', appointmentData);
      // await refreshAppointments();
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === id ? { ...appointment, ...appointmentData } : appointment
      );
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Em produção:
      // await api.put(`/appointments/${id}`, appointmentData);
      // await refreshAppointments();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Em produção:
      // await api.delete(`/appointments/${id}`);
      // await refreshAppointments();
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  };

  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.find(appointment => appointment.id === id);
  };

  const getAppointmentsByDate = (date: Date): Appointment[] => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const refreshAppointments = async () => {
    await loadAppointments();
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const value: AppointmentContextType = {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsByDate,
    isLoading,
    refreshAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};