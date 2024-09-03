import { IEvent } from "../../model/IEvent";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import EventService from "./EventService";

class EventServiceGet extends EventService {
  static baseRoute = 'events';

  /**
   * Retrieves all events.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of events.
   * @throws If an error occurs while retrieving the events.
   */
  static async getAll(token: IToken | null): Promise<IEvent[]> {
    try {
      const events = await APIService.get<IEvent[]>(this.baseRoute, token?.value as string);
      return events;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all archived events.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of events.
   * @throws If an error occurs while retrieving the events.
   */
  static async getArchivedEvents(token: IToken | null): Promise<IEvent[]> {
    try {
      const url = `${this.baseRoute}/archived`;
      const events = await APIService.get<IEvent[]>(url, token?.value as string);
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
  static async getAllForClient(clientID: string, token: IToken | null): Promise<IEvent[]> {
    try {
      const url = `${this.baseRoute}/client/${clientID}`;
      const events = await APIService.get<IEvent[]>(url, token?.value as string);
      return events;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all archived events for the specified client.
   * @param clientID - The ID of the client to retrieve archived events for.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of events.
   * @throws If an error occurs while retrieving the events.
   */
  static async getArchivedForClient(clientID: string, token: IToken | null): Promise<IEvent[]> {
    try {
      const url = `${this.baseRoute}/client/archived/${clientID}`;
      const events = await APIService.get<IEvent[]>(url, token?.value as string);
      return events;
    } catch (error) {
      throw error;
    }
  }
}

export default EventServiceGet;