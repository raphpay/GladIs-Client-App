// Models
import { IEmail } from '../../model/IEmail';
// Services
import EmailService from '../../services/EmailService';
// Constants
import { FROM_MAIL, FROM_NAME, SEND_GRID_API_KEY } from '../../utils/envConfig';

// TODO: - Add documentation
/**
 * A class to handle the password reset screen logic
 */
class PasswordResetScreenManager {
  private static instance: PasswordResetScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): PasswordResetScreenManager {
    if (!PasswordResetScreenManager.instance) {
      PasswordResetScreenManager.instance = new PasswordResetScreenManager();
    }
    return PasswordResetScreenManager.instance;
  }

  async sendEmail(toEmail: string, resetToken: string) {
    const mailContent = this.generateMailContent(resetToken);
    const email = this.createEmail(mailContent, toEmail);
    try {
      await EmailService.getInstance().sendEmail(email);
    } catch (error) {
      throw error;
    }
  }

  // Private sync methods
  private generateMailContent(resetToken: string, locale: string = 'fr') {
    let mailContent = '';
    // TODO: Make sure the content is in HTML.
    if (locale == 'fr') {
      mailContent = `Bonjour,\n Votre fournisseur a réalisé une demande de changement de mot de passe pour vous.\n Veuillez entrer la clé suivante dans l'application: ${resetToken}`;
    } else {
      mailContent = `Hello,\n Your provider realised a request for a password change\n. Please enter the following key in the application ${resetToken}`;
    }
    return mailContent;
  }

  // TODO: Correct mail subject translation
  private createEmail(mailContent: string, email: string): IEmail {
    const sendGridEmail: IEmail = {
      to: [email],
      fromMail: FROM_MAIL,
      fromName: FROM_NAME,
      replyTo: FROM_MAIL,
      subject: 'Glad-Is - Demande de changement de mot de passe',
      content: mailContent,
      apiKey: SEND_GRID_API_KEY,
      isHTML: true,
    };

    return sendGridEmail;
  }
}

export default PasswordResetScreenManager;
