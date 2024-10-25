import { IEvent, IEventInput } from '../../model/IEvent';
import IToken from '../../model/IToken';
import APIService from '../APIService';
import EventService from './EventService';

class EventServicePost extends EventService {
  static baseRoute = 'events';

  /**
   * Retrieves the events for the specified client.
   * @param event - The event to create.
   * @param token - The authentication token.
   * @returns A promise that resolves to the created event.
   * @throws If an error occurs while creating the event.
   */
  static async create(
    event: IEventInput,
    token: IToken | null,
  ): Promise<IEvent> {
    try {
      const newEvent = await APIService.post<IEvent>(
        this.baseRoute,
        event,
        token?.value as string,
      );
      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new event for a login attempt.
   * @param event - The event to create.
   * @returns A promise that resolves to the created event.
   * @throws If an error occurs while creating the event.
   */
  static async createMaxAttemptsEvent(event: IEventInput): Promise<IEvent> {
    try {
      const newEvent = await APIService.post<IEvent>(
        `${this.baseRoute}/maxLogin`,
        event,
      );
      return newEvent;
    } catch (error) {
      throw error;
    }
  }
}

export default EventServicePost;
