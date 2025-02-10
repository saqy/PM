import type { ScheduledEvent, ProjectManager } from '../types/scheduling';
import { WORKING_HOURS } from '../constants/scheduling';

export const calculateMetrics = (events: ScheduledEvent[], projectManagers: ProjectManager[]) => ({
  totalPMs: projectManagers.length,
  totalCalls: events.length,
  completedCalls: events.filter(e => e.status === 'completed').length,
  conflictCount: calculateConflicts(events).length
});

export const calculatePMAvailability = (events: ScheduledEvent[], projectManagers: ProjectManager[]) => 
  projectManagers.map(pm => {
    const pmEvents = events.filter(e => e.projectManager === pm.name);
    const totalHours = WORKING_HOURS.length;
    const bookedHours = pmEvents.length;
    
    return {
      name: pm.name,
      available: totalHours - bookedHours,
      booked: bookedHours,
      percentage: ((totalHours - bookedHours) / totalHours) * 100
    };
  });

export const calculateHourlyDistribution = (events: ScheduledEvent[]) =>
  WORKING_HOURS.map(hour => ({
    hour,
    count: events.filter(e => new Date(e.startTime).getHours() === parseInt(hour)).length
  }));

export const calculateWorkloadDistribution = (events: ScheduledEvent[], projectManagers: ProjectManager[]) =>
  projectManagers.map(pm => ({
    name: pm.name,
    value: events.filter(e => e.projectManager === pm.name).length
  }));

const calculateConflicts = (events: ScheduledEvent[]) => 
  events.filter(e1 => 
    events.some(e2 => 
      e1.id !== e2.id &&
      e1.projectManager === e2.projectManager &&
      new Date(e1.startTime).getTime() === new Date(e2.startTime).getTime()
    )
  ); 