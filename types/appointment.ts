export interface Appointment {
  id: string;
  title: string;
  type: 'veterinary' | 'grooming' | 'consultation' | 'checkup' | 'vaccination' | 'other';
  petId?: string;
  petName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  color?: string;
  createdAt: Date;
}

export interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
  getAppointmentsByDate: (date: Date) => Appointment[];
  isLoading: boolean;
  refreshAppointments: () => Promise<void>;
}