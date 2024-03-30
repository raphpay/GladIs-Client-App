import { IMessage } from '../model/IMessage';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 *
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

  async getReceivedMessagesForUser(userID: string, token: IToken | null): Promise<IMessage[]> {
    try {
      const url = `${this.userRoute}/${userID}/${this.baseRoute}/received`;
      const messages = await APIService.get<IMessage[]>(url ,token?.value as string);
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
