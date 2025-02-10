import type { ScheduledEvent } from '../types/scheduling';

export class SchedulingService {
  static validateEvent(event: ScheduledEvent): boolean {
    // Implement validation logic
    return true;
  }

  static checkConflicts(event: ScheduledEvent, existingEvents: ScheduledEvent[]): ScheduledEvent[] {
    return existingEvents.filter(existing =>
      existing.projectManager === event.projectManager &&
      this.hasTimeOverlap(event, existing)
    );
  }

  private static hasTimeOverlap(event1: ScheduledEvent, event2: ScheduledEvent): boolean {
    const start1 = new Date(event1.startTime).getTime();
    const end1 = new Date(event1.endTime).getTime();
    const start2 = new Date(event2.startTime).getTime();
    const end2 = new Date(event2.endTime).getTime();

    return start1 < end2 && end1 > start2;
  }
} 