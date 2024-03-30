import { IMessage } from '../model/IMessage';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * A service for managing messages.
 */
class MessageService {
  private static instance: MessageService | null = null;
  private baseRoute = 'messages';
  private userRoute = 'users';

  private constructor() {}

  /**
   * Gets the singleton instance of the MessageService class.
   * @returns The singleton instance of the MessageService class.
   */
  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  /**
   * Gets all received messages for a user.
   * @param userID The ID of the user to get messages for.
   * @param token The token to use for authentication.
   * @returns A promise that resolves to an array of messages.
   * @throws An error if the request fails.
   */
  async getReceivedMessagesForUser(userID: string, token: IToken | null): Promise<IMessage[]> {
    try {
      const url = `${this.userRoute}/${userID}/${this.baseRoute}/received`;
      const messages = await APIService.get<IMessage[]>(url ,token?.value as string);
      return messages;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets all sent messages for a user.
   * @param userID The ID of the user to get messages for.
   * @param token The token to use for authentication.
   * @returns A promise that resolves to an array of messages.
   * @throws An error if the request fails.
   */
  async getMessagesForUser(userID: string, token: IToken | null): Promise<IMessage[]> {
    try {
      const url = `${this.userRoute}/${userID}/${this.baseRoute}/all`;
      const messages = await APIService.get<IMessage[]>(url ,token?.value as string);
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;