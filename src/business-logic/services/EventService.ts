import { IEvent, IEventInput } from '../model/IEvent';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing documents.
 */
class EventService {
  private static instance: EventService | null = null;
  private baseRoute = 'events';

  private constructor() {}

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

  /**
   * Retrieves the events for the specified client.
   * @param event - The event to create.
   * @param token - The authentication token.
   * @returns A promise that resolves to the created event.
   * @throws If an error occurs while creating the event.
   */
  async create(event: IEventInput, token: IToken | null): Promise<IEvent> {
    try {
      const newEvent = await APIService.post<IEvent>(this.baseRoute, event, token?.value as string);
      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all events.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of events.
   * @throws If an error occurs while retrieving the events.
   */
  async getAll(token: IToken | null): Promise<IEvent[]> {
    try {
      const events = await APIService.get<IEvent[]>(this.baseRoute, token?.value as string);
      return events;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all events for the specified client.
   * @param clientID - The ID of the client to retrieve events for.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of events.
   * @throws If an error occurs while retrieving the events.
   */
  async getAllForClient(clientID: string, token: IToken | null): Promise<IEvent[]> {
    try {
      const url = `${this.baseRoute}/client/${clientID}`;
      const events = await APIService.get<IEvent[]>(url, token?.value as string);
      return events;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the event with the specified ID.
   * @param eventIDToUpdate - The ID of the event to update.
   * @param event - The updated version of the event.
   * @param token - The authentication token.
   * @returns A promise that resolves to the updated event.
   * @throws If an error occurs while updating the event.
   */
  async update(eventIDToUpdate: string, event: IEvent, token: IToken | null): Promise<IEvent> {
    try {
      const url = `${this.baseRoute}/${eventIDToUpdate}`;
      const updatedEvent = await APIService.put(url, event, token?.value as string);
      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes the event with the specified ID.
   * @param eventID - The ID of the event to remove.
   * @param token - The authentication token.
   * @returns A promise that resolves when the event is removed.
   * @throws If an error occurs while removing the event.
   */
  async remove(eventID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/${eventID}`;
      await APIService.delete(url, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default EventService;
