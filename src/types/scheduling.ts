export interface ScheduledEvent {
  id: number;
  title: string;
  startTime: string;  // ISO string
  endTime: string;    // ISO string
  projectManager: string;
  clientName: string;
  eventType: EventType;
  status: EventStatus;
}

export enum EventType {
  FIXED = 'fixed',
  IMPROMPTU = 'impromptu'
}

export enum EventStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ProjectManager {
  id: number;
  name: string;
  email: string;
  maxDailyCapacity: number;
  specializations: string[];
  availability?: DailyAvailability;
}

export interface DailyAvailability {
  availableHours: number;
  bookedHours: number;
  availabilityPercentage: number;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
} 