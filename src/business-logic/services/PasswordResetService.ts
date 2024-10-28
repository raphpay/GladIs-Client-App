// Models
import IPasswordResetToken from '../model/IPasswordResetToken';
import IToken from '../model/IToken';
import { EmailInput } from '../model/IUser';
// Services
import APIService from './APIService';

/**
 * Service class for handling password reset requests.
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

  // CREATE
  /**
   * Sends a password reset request to the server.
   * @param toEmail The email address to send the password reset request to.
   * @returns A promise that resolves with a password reset token object.
   * @throws An error if the request fails.
   */
  async requestPasswordReset(toEmail: string): Promise<IPasswordResetToken> {
    try {
      const input: EmailInput = {
        email: toEmail,
      };
      const url = `${this.baseRoute}/request`;
      const passwordResetToken = await APIService.post<IPasswordResetToken>(
        url,
        input,
      );
      return passwordResetToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resets the password for a user.
   * @param token The password reset token.
   * @param newPassword The new password.
   * @returns A promise that resolves when the request is complete.
   * @throws An error if the request fails.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await APIService.postWithoutResponse(`${this.baseRoute}/reset`, {
        token,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  // READ
  /**
   * Gets all password reset tokens.
   * @param token The token to use for authentication.
   * @returns A promise that resolves with an array of password reset tokens.
   * @throws An error if the request fails.
   */
  async getAll(token: IToken | null): Promise<IPasswordResetToken[]> {
    try {
      const resetTokens = await APIService.get<IPasswordResetToken[]>(
        this.baseRoute,
        token?.value as string,
      );
      return resetTokens;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  /**
   * Deletes a password reset token.
   * @param id The ID of the password reset token to delete.
   * @param token The token to use for authentication.
   * @returns A promise that resolves when the request is complete.
   * @throws An error if the request fails.
   */
  async delete(id: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(
        `${this.baseRoute}/${id}`,
        token?.value as string,
      );
    } catch (error) {
      throw error;
    }
  }
}

export default PasswordResetService;
