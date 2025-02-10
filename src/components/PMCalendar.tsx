import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import toast from 'react-hot-toast';
import { Event, ProjectManager } from '../types';
import { CallForm } from './CallForm';
import { Alert } from './ui/Alert';
import { CustomSelect } from './ui/Select';
import { mockPMs } from '../utils/mockData';
import { motion } from 'framer-motion';

interface Props {
  events: Event[];
  onEventAdd: (event: Event) => void;
  onEventUpdate: (event: Event) => void;
}

export function PMCalendar({ events, onEventAdd, onEventUpdate }: Props) {
  const [showCallForm, setShowCallForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPMs, setSelectedPMs] = useState<any>(
    mockPMs.map(pm => ({
      value: pm.id,
      label: pm.name,
    }))
  );
  
  const [conflicts, setConflicts] = React.useState<{ [key: string]: Event[] }>({});

  // Updated conflict check to handle overlapping times
  React.useEffect(() => {
    const newConflicts: Record<string, Event[]> = {};

    events.forEach((event1) => {
      const event1Start = new Date(event1.start_time).getTime();
      const event1End = new Date(event1.end_time).getTime();

      events.forEach((event2) => {
        if (event1.id === event2.id) return; // Skip same event

        const event2Start = new Date(event2.start_time).getTime();
        const event2End = new Date(event2.end_time).getTime();

        // Check if events overlap and are for the same PM
        if (event1.user_id === event2.user_id &&
          ((event1Start >= event2Start && event1Start < event2End) || // event1 starts during event2
            (event2Start >= event1Start && event2Start < event1End))) { // event2 starts during event1

          // Create a key that includes both event times to handle multiple conflicts
          const timeKey = `${event1.user_id}-${Math.min(event1Start, event2Start)}`;

          if (!newConflicts[timeKey]) {
            newConflicts[timeKey] = [];
          }

          // Add both events if they're not already included
          if (!newConflicts[timeKey].find(e => e.id === event1.id)) {
            newConflicts[timeKey].push(event1);
          }
          if (!newConflicts[timeKey].find(e => e.id === event2.id)) {
            newConflicts[timeKey].push(event2);
          }
        }
      });
    });

    setConflicts(newConflicts);

    // Show toast for conflicts
    const totalConflicts = Object.keys(newConflicts).length;
    if (totalConflicts > 0) {
      toast.dismiss();

      toast.custom(
        (t) => (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-lg max-w-md"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Scheduling Conflicts Detected
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Found {totalConflicts} scheduling conflict{totalConflicts > 1 ? 's' : ''}:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {Object.entries(newConflicts).map(([key, events]) => {
                      const pm = mockPMs.find(pm => pm.id === events[0].user_id);
                      return (
                        <li key={key}>
                          {pm?.name}: {events.length} overlapping calls starting at{' '}
                          {new Date(events[0].start_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-sm text-red-800 hover:text-red-900 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ),
        {
          duration: 10000,
          position: 'top-right',
          id: 'conflicts-toast'
        }
      );
    }
  }, [events]);

  // Update calendarEvents to properly check for conflicts
  const calendarEvents = events
    .filter(event => selectedPMs.some(pm => pm.value === event.user_id))
    .map(event => {
      // Check if this event has any conflicts
      const hasConflict = Object.values(conflicts).some(conflictGroup =>
        conflictGroup.some(conflictEvent => conflictEvent.id === event.id)
      );

      const pm = mockPMs.find(pm => pm.id === event.user_id);

      return {
        id: String(event.id),
        title: `${event.title} (${event.client_id})`,
        start: event.start_time,
        end: event.end_time,
        resourceId: event.user_id,
        backgroundColor: hasConflict ? '#EF4444' : '#3B82F6',
        borderColor: hasConflict ? '#DC2626' : '#2563EB',
        textColor: '#FFFFFF',
        classNames: hasConflict ? ['conflict-event'] : [],
        extendedProps: {
          hasConflict,
          ...event
        }
      };
    });

  const resources = mockPMs
  .filter(pm => selectedPMs.some(selectedPM => selectedPM.value === pm.id))
    .map(pm => ({
      id: pm.id,
      title: pm.name
    }));

  const handleDateSelect = useCallback((selectInfo: any) => {
    setSelectedDate(selectInfo.startStr);
    setShowCallForm(true);
  }, []);

  const handleEventDrop = useCallback((dropInfo: any) => {
    const updatedEvent: Event = {
      ...dropInfo.event.extendedProps,
      id: Number(dropInfo.event.id),
      start_time: dropInfo.event.startStr,
      end_time: dropInfo.event.endStr,
      user_id: dropInfo.event.getResources()[0]?.id || dropInfo.event.extendedProps.user_id,
      updated_at: new Date().toISOString()
    };

    onEventUpdate(updatedEvent);
    toast.success('Call rescheduled successfully!', {
      position: 'top-right',
    });
  }, [onEventUpdate]);

  const handleEventAdd = (newEvent: Event) => {
    onEventAdd(newEvent);
    toast.success('Call scheduled successfully!', {
      position: 'top-right',
    });
    return true;
  };

  const handleSelectChange = (
    selectedOptions: any, // react-select will provide a MultiValue
    actionMeta: any
  ) => {
    console.log("selectedOptions")
    console.log(selectedOptions)
    setSelectedPMs(selectedOptions || []); // Update state with selected options
  };

  // Custom styles for the calendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fc {
        --fc-border-color: #e5e7eb;
        --fc-today-bg-color: #EFF6FF;
        --fc-neutral-bg-color: #ffffff;
        --fc-list-event-hover-bg-color: #f3f4f6;
        --fc-theme-standard-border-color: #e5e7eb;
      }

      .fc .fc-toolbar {
        padding: 1.5rem;
        background: white;
        border-bottom: 1px solid #e5e7eb;
      }

      .fc .fc-toolbar-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
      }

      .fc .fc-button {
        padding: 0.5rem 1rem;
        font-weight: 500;
        border-radius: 0.5rem;
        transition: all 0.2s;
        background: white;
        border: 1px solid #e5e7eb;
        color: #374151;
      }

      .fc .fc-button:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      .fc .fc-button-primary:not(:disabled).fc-button-active,
      .fc .fc-button-primary:not(:disabled):active {
        background: #2563eb;
        border-color: #2563eb;
        color: white;
      }

      .fc-event {
        border-radius: 6px;
        padding: 2px 4px;
        font-size: 0.875rem;
        border: none;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .fc-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .fc-timegrid-slot {
        height: 48px !important;
      }

      .fc-timegrid-slot-label {
        font-size: 0.75rem;
        color: #6b7280;
        font-weight: 500;
      }

      .fc-resource-timeline-divider {
        background: #f3f4f6;
        width: 2px !important;
      }

      .fc-resource-group {
        font-weight: 600;
        color: #374151;
      }

      .conflict-event {
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }

      .fc-timeline-slot-cushion {
        font-weight: 500;
        color: #374151;
      }

      .fc-timeline-header {
        background: #f9fafb;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-4 p-6 bg-gray-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900"></h2>
        <div className="flex items-center space-x-4">
          <CustomSelect
            label="Select Project Managers"
            options={mockPMs.map((pm) => ({
              value: pm.id,
              label: pm.name,
            }))}
            value={selectedPMs}
            onChange={handleSelectChange}
            error=""
          />
        </div>
      </motion.div>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
          initialView="resourceTimeGridDay"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          resources={resources}
          events={calendarEvents}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          height="calc(100vh - 200px)"
          allDaySlot={false}
          nowIndicator={true}
          initialDate={new Date()}
          resourceAreaWidth="200px"
          resourceLabelDidMount={(info) => {
            info.el.style.fontSize = '0.875rem';
            info.el.style.padding = '8px';
          }}
          eventDidMount={(info) => {
            info.el.style.fontSize = '0.875rem';
            info.el.style.padding = '4px 8px';
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotLaneClassNames="hover:bg-gray-50"
          eventClassNames="rounded-lg shadow-sm"
          dayCellClassNames="hover:bg-gray-50"
          resourceLabelClassNames="font-medium text-gray-700"
          views={{
            resourceTimeGridDay: {
              slotDuration: '00:30:00',
              slotLabelInterval: '01:00'
            },
            resourceTimeGridWeek: {
              slotDuration: '01:00:00',
              slotLabelInterval: '01:00'
            }
          }}
        />
      </motion.div>

      {/* Call Form Modal */}
      {showCallForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CallForm
            selectedDate={selectedDate}
            onClose={() => setShowCallForm(false)}
            onSubmit={(newEvent) => {
              if (handleEventAdd(newEvent)) {
                setShowCallForm(false);
              }
            }}
            events={events}
          />
        </motion.div>
      )}
    </div>
  );
} 