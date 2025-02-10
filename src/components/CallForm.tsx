import React, { useState } from 'react';
import { Event } from '../types';
import { mockPMs, mockClients } from '../utils/mockData';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';

interface Props {
  selectedDate: string | null;
  onClose: () => void;
  onSubmit: (event: Event) => void;
  events: Event[];
}

export function CallForm({ selectedDate, onClose, onSubmit, events }: Props) {
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'start_time' | 'end_time' | 'created_at' | 'updated_at'>>({
    title: '',
    client_id: 0,
    user_id: '',
    call_type: 'fixed',
    status: 'scheduled',
    duration_minutes: 30,
    is_recurring: false,
    recurrence_pattern: 'weekdays'
  });

  const [customDuration, setCustomDuration] = useState(false);

  const durations = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
  ];

  // Generate time slots from 8 AM to 6 PM
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        (slots as any).push({
          time: timeString,
          available: true
        });
      }
    }
    return slots;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (selectedDate && formData.title && formData.client_id && formData.user_id) {
      const formElement = e.currentTarget;
      const timeInput = formElement.elements.namedItem('time') as HTMLSelectElement;
      const [hours, minutes] = timeInput.value.split(':');
      const startDate = new Date(selectedDate);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + formData.duration_minutes);

      const baseEvent = {
        id: Date.now(),
        ...formData,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (formData.is_recurring && formData.recurrence_pattern === 'weekdays') {
        // Create events for all weekdays in the next 3 months
        const events: Event[] = [];
        const endRecurrence = new Date(startDate);
        endRecurrence.setMonth(endRecurrence.getMonth() + 3);

        let currentDate = new Date(startDate);
        while (currentDate <= endRecurrence) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
            const eventStart = new Date(currentDate);
            const eventEnd = new Date(currentDate);
            eventEnd.setMinutes(eventStart.getMinutes() + formData.duration_minutes);

            events.push({
              ...baseEvent,
              id: Date.now() + events.length,
              start_time: eventStart.toISOString(),
              end_time: eventEnd.toISOString()
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        events.forEach(event => onSubmit(event));
      } else {
        onSubmit(baseEvent);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Schedule New Call</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: parseInt(e.target.value) })}
            >
              <option value="">Select a Client</option>
              {mockClients.map(client => (
                <option key={client.id} value={client.id}>{client.company_name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              {!customDuration ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration_minutes: duration.value })}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.duration_minutes === duration.value
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  min="1"
                  max="480"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  placeholder="Duration in minutes"
                />
              )}
              <button
                type="button"
                onClick={() => setCustomDuration(!customDuration)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {customDuration ? 'Use preset durations' : 'Set custom duration'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <select
                name="time"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot.time} value={slot.time}>
                    {slot.time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="text-sm font-medium text-gray-700">
                  Recurring Call
                </Switch.Label>
                <Switch
                  checked={formData.is_recurring}
                  onChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
                  className={`${
                    formData.is_recurring ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      formData.is_recurring ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>

            {formData.is_recurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Recurrence Pattern</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.recurrence_pattern}
                  onChange={(e) => setFormData({ ...formData, recurrence_pattern: e.target.value as 'weekdays' | 'weekly' | 'monthly' })}
                >
                  <option value="weekdays">Every Weekday</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Manager</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            >
              <option value="">Select a PM</option>
              {mockPMs.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.call_type}
              onChange={(e) => setFormData({ ...formData, call_type: e.target.value as 'impromptu' | 'fixed' })}
            >
              <option value="fixed">Fixed</option>
              <option value="impromptu">Impromptu</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Schedule Call
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 