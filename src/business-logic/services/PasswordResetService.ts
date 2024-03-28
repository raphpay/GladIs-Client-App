import IPasswordResetToken from "../model/IPasswordResetToken";
import IToken from "../model/IToken";
import { EmailInput } from "../model/IUser";
import APIService from "./APIService";

/**
 * TODO: add description
 */
class PasswordResetService {
  private static instance: PasswordResetService | null = null;
  private baseRoute = 'passwordResetTokens';

  private constructor() {}

  /**
   * Gets the singleton instance of the PasswordResetService class.
   * @returns The singleton instance of the PasswordResetService class.
   */
  static getInstance(): PasswordResetService {
    if (!PasswordResetService.instance) {
      PasswordResetService.instance = new PasswordResetService();
    }
    return PasswordResetService.instance;
  }

  async requestPasswordReset(toEmail: string): Promise<void> {
    try {
      const input: EmailInput = {
        email: toEmail
      };
      await APIService.postWithoutResponse(`${this.baseRoute}/request`, input);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await APIService.postWithoutResponse(`${this.baseRoute}/reset`, { token, newPassword });
    } catch (error) {
      throw error;
    }
  }

  async getAll(token: IToken | null): Promise<IPasswordResetToken[]> {
    try {
      const resetTokens = await APIService.get<IPasswordResetToken[]>(this.baseRoute, token?.value as string);
      return resetTokens;
    } catch (error) {
      throw error;
    }
  }
}

export default PasswordResetService;
