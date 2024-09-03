import IToken from "../../model/IToken";
import APIService from "../APIService";
import EventService from "./EventService";

class EventServiceDelete extends EventService {
  static baseRoute = 'events';

  /**
   * Removes the event with the specified ID.
   * @param eventID - The ID of the event to remove.
   * @param token - The authentication token.
   * @returns A promise that resolves when the event is removed.
   * @throws If an error occurs while removing the event.
   */
  static async remove(eventID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/${eventID}`;
      await APIService.delete(url, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Archives the event with the specified ID.
   * @param eventID - The ID of the event to archive.
   * @param token - The authentication token.
   * @returns A promise that resolves when the event is archived.
   */
  static async archive(eventID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/archive/${eventID}`;
      await APIService.delete(url, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default EventServiceDelete;