import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAvailability } from '../../hooks/useAvailability';
import { AvailabilityGrid } from '../calendar/AvailabilityGrid';
import type { ScheduledEvent, ProjectManager } from '../../types/scheduling';
import { Modal } from '../ui/Modal';
import { EventForm } from './EventForm';

interface ScheduleCallFormProps {
  selectedDate: string | null;
  projectManagers: ProjectManager[];
  events: ScheduledEvent[];
  onSubmit: (event: ScheduledEvent) => void;
  onClose: () => void;
}

export const ScheduleCallForm: React.FC<ScheduleCallFormProps> = ({
  selectedDate,
  projectManagers,
  events,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState<Omit<ScheduledEvent, 'id' | 'startTime' | 'endTime'>>({
    title: '',
    clientName: '',
    projectManager: '',
    eventType: EventType.FIXED,
    status: EventStatus.SCHEDULED
  });

  const availability = useAvailability({
    projectManagers,
    scheduledEvents: events,
    selectedDate: selectedDate || ''
  });

  const handleSubmit = (event: ScheduledEvent) => {
    onSubmit(event);
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6">
        <AvailabilityGrid availability={availability} />
        <EventForm
          formData={formData}
          onChange={setFormData}
          availability={availability}
          onSubmit={handleSubmit}
        />
      </div>
    </Modal>
  );
}; 