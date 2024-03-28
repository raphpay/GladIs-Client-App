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
      await APIService.postWithoutResponse(`${this.baseRoute}/request`, toEmail);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await APIService.post(`${this.baseRoute}/reset`, { token, newPassword });
    } catch (error) {
      throw error;
    }
  }
}

export default PasswordResetService;
