import { IMessage, IMessageInput } from '../model/IMessage';
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

  // CREATE
  /**
   * Sends a message.
   * @param message The message to send.
   * @param token The token to use for authentication.
   * @returns A promise that resolves to the sent message.
   * @throws An error if the request fails.
   */
  async sendMessage(message: IMessageInput, token: IToken | null): Promise<IMessage> {
    try {
      const newMessage = await APIService.post<IMessage>(this.baseRoute, message, token?.value as string);
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  // READ
  /**
   * Gets all messages.
   * @param token The token to use for authentication.
   * @returns A promise that resolves to an array of messages.
   * @throws An error if the request fails.
   */
  async getAllMessages(token: IToken | null) : Promise<IMessage[]> {
    try {
      const messages = await APIService.get<IMessage[]>(this.baseRoute, token?.value as string);
      return messages;
    } catch (error) {
      throw error;
    }
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

  // DELETE
  /**
   * Deletes a message.
   * @param messageID The ID of the message to delete.
   * @param token The token to use for authentication.
   * @throws An error if the request fails.
   * @returns A promise that resolves when the message is deleted.
   */
  async deleteMessage(messageID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${messageID}`, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
