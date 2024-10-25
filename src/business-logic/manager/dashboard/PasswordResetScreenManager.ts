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

  async sendEmail(toEmail: string, resetToken: string, locale: string = 'fr') {
    const mailContent = this.generateMailContent(resetToken, locale);
    const email = this.createEmail(mailContent, toEmail, locale);
    try {
      await EmailService.getInstance().sendEmail(email);
    } catch (error) {
      throw error;
    }
  }

  // Private sync methods
  private generateMailContent(resetToken: string, locale: string = 'fr') {
    let mailContent = '';
    if (locale == 'fr') {
      mailContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
              max-width: 600px;
              margin: 0 auto;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .message {
              font-size: 16px;
              color: #555;
              margin-top: 10px;
            }
            .reset-token {
              font-weight: bold;
              color: transparent;
              background-color: #f0f0f0;
              padding: 5px 10px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
              user-select: none;
            }
            .reset-token:hover {
              color: #2a7ae2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="title">Bonjour,</p>
            <p class="message">
              Votre fournisseur a réalisé une demande de changement de mot de passe pour vous.<br />
              Veuillez entrer la clé suivante dans l'application :
            </p>
            <div class="reset-token" onmouseover="this.style.color='#2a7ae2'">
              ${resetToken}
            </div>
          </div>
        </body>
      </html>
    `;
    } else {
      mailContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
              max-width: 600px;
              margin: 0 auto;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .message {
              font-size: 16px;
              color: #555;
              margin-top: 10px;
            }
            .reset-token {
              font-weight: bold;
              color: transparent;
              background-color: #f0f0f0;
              padding: 5px 10px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
              user-select: none;
            }
            .reset-token:hover {
              color: #2a7ae2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="title">Hello,</p>
            <p class="message">
              Your provider realised a request for a password change.<br />
              Please enter the following key in the application:
            </p>
            <div class="reset-token" onmouseover="this.style.color='#2a7ae2'">
              ${resetToken}
            </div>
          </div>
        </body>
      </html>
    `;
    }
    return mailContent;
  }

  private createEmail(
    mailContent: string,
    email: string,
    locale: string = 'fr',
  ): IEmail {
    let subject = '';
    if (locale === 'fr') {
      subject = 'Glad-Is - Demande de changement de mot de passe';
    } else {
      subject = 'Glad-Is - Reset password request';
    }
    const sendGridEmail: IEmail = {
      to: [email],
      fromMail: FROM_MAIL,
      fromName: FROM_NAME,
      replyTo: FROM_MAIL,
      subject,
      content: mailContent,
      apiKey: SEND_GRID_API_KEY,
      isHTML: true,
    };

    return sendGridEmail;
  }
}

export default PasswordResetScreenManager;
