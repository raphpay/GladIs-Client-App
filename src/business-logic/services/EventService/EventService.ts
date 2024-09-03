
/**
 * Represents a service for managing documents.
 */
class EventService {
  private static instance: EventService | null = null;
  private baseRoute = 'events';

  constructor() {}

  /**
   * Gets the singleton instance of the EventService class.
   * @returns The singleton instance of the EventService class.
   */
  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }
}

export default EventService;
