import { IEmail } from '../model/IEmail';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * A service for managing messages.
 */
class EmailService {
  private static instance: EmailService | null = null;
  private baseRoute = 'emails';

  private constructor() {}

  /**
   * Gets the singleton instance of the EmailService class.
   * @returns The singleton instance of the EmailService class.
   */
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // CREATE
  /**
   * Sends a message.
   * @param message The message to send.
   * @param token The token to use for authentication.
   * @returns A promise that resolves to the sent message.
   * @throws An error if the request fails.
   */
  async sendEmail(email: IEmail, token: IToken | null): Promise<void> {
    try {
      await APIService.post<IEmail>(this.baseRoute, email, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default EmailService;
