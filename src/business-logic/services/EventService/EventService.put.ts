import IToken from "../../model/IToken";
import APIService from "../APIService";
import EventService from "./EventService";

class EventServicePut extends EventService {
  static baseRoute = 'events';

  /**
   * Restores the event with the specified ID.
   * @param eventID - The ID of the event to restore.
   * @param token - The authentication token.
   * @returns A promise that resolves when the event is restored.
   * @throws If an error occurs while restoring the event.
   */
  static async restore(eventID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/restore/${eventID}`;
      await APIService.put(url, {}, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default EventServicePut;