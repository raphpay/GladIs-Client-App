// Models
import { IEmail } from '../model/IEmail';
// Services
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
  async sendEmail(email: IEmail): Promise<void> {
    try {
      await APIService.postWithoutResponse(this.baseRoute, email);
    } catch (error) {
      throw error;
    }
  }
}

export default EmailService;
