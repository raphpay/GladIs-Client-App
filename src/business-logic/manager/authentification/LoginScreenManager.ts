// Models
import { IEmail } from '../../model/IEmail';
import { IEventInput } from '../../model/IEvent';
import IPasswordResetToken from '../../model/IPasswordResetToken';
import IToken from '../../model/IToken';
import { ILoginTryOutput } from '../../model/IUser';
// Services
import AuthenticationService from '../../services/AuthenticationService/AuthenticationService';
import EmailService from '../../services/EmailService';
import EventServicePost from '../../services/EventService/EventService.post';
import PasswordResetService from '../../services/PasswordResetService';
import UserServicePost from '../../services/UserService/UserService.post';
import UserServicePut from '../../services/UserService/UserService.put';
// Constants
import { FROM_MAIL, FROM_NAME, SEND_GRID_API_KEY } from '../../utils/envConfig';

/**
 * A class to handle login screen logic
 */
class LoginScreenManager {
  private static instance: LoginScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): LoginScreenManager {
    if (!LoginScreenManager.instance) {
      LoginScreenManager.instance = new LoginScreenManager();
    }
    return LoginScreenManager.instance;
  }

  async login(identifier: string, password: string): Promise<IToken> {
    try {
      const token = await AuthenticationService.getInstance().login(
        identifier,
        password,
      );
      return token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates and retrieves the user's connection attempts, incrementing the count if necessary.
   * @param identifier - The unique identifier for the user.
   * @returns A promise that resolves to an `ILoginTryOutput` object containing updated connection attempt information.
   * @throws If an error occurs while retrieving or updating connection attempts.
   */
  async updateUserConnectionAttempts(
    identifier: string,
  ): Promise<ILoginTryOutput> {
    try {
      const output = await UserServicePost.getUserLoginTryOutput(identifier);
      const tryAttemptsCount = await UserServicePut.blockUserConnection(
        output.id as string,
      );
      output.connectionFailedAttempts = tryAttemptsCount;
      return output;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sends an event recording the user’s maximum login attempts.
   * @param tryOutput - An `ILoginTryOutput` object containing user details for the event.
   * @returns A promise that resolves when the max attempts event is created.
   * @throws Logs an error if sending the max attempts event fails.
   */
  async sendMaxLoginEvent(event: IEventInput, tryOutput: ILoginTryOutput) {
    try {
      await EventServicePost.createMaxAttemptsEvent(event);
    } catch (error) {
      console.log('Error sending max attempts event', error);
    }
  }

  /**
   * Requests a password reset token for the specified email.
   * @param resetEmail - The email address of the user requesting a password reset.
   * @returns A promise that resolves to an `IPasswordResetToken` containing the reset token details.
   * @throws If an error occurs during the password reset token request.
   */
  async requestPasswordReset(resetEmail: string): Promise<IPasswordResetToken> {
    try {
      const resetPasswordToken =
        await PasswordResetService.getInstance().requestPasswordReset(
          resetEmail,
        );
      return resetPasswordToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sends a password reset email with the specified reset token to the user.
   * @param toEmail - The recipient’s email address.
   * @param resetToken - The password reset token to include in the email content.
   * @param locale - The language locale for the email content, default is French ('fr').
   * @returns A promise that resolves when the email is successfully sent.
   * @throws If an error occurs while sending the email.
   */
  async sendEmailWithPasswordResetToken(
    toEmail: string,
    resetToken: string,
    locale: string = 'fr',
  ) {
    const mailContent = this.generateMailContent(resetToken, locale);
    const email = this.createEmail(mailContent, toEmail);
    try {
      await EmailService.getInstance().sendEmail(email);
    } catch (error) {
      throw error;
    }
  }

  // Private sync methods
  /**
   * Generates an HTML-formatted email content for a password reset request, localized based on the specified language.
   * The email includes the reset token and styled message content.
   * @param resetToken - The unique reset token for the user to enter in the application.
   * @param locale - The language locale for the email content, default is French ('fr'). Supported values are 'fr' for French and 'en' for English.
   * @returns A string containing the HTML-formatted email content.
   */
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
            .token {
              font-weight: bold;
              color: #2a7ae2;
              background-color: #f0f0f0;
              padding: 5px 10px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="title">Bonjour,</p>
            <p class="message">
              Vous avez demandé un changement de mot de passe.<br />
              Veuillez entrer la clé suivante dans l'application :
            </p>
            <div class="token" style="color: transparent; user-select: none;" onmouseover="this.style.color='#2a7ae2'">
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
            .token {
              font-weight: bold;
              color: #2a7ae2;
              background-color: #f0f0f0;
              padding: 5px 10px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="title">Bonjour,</p>
            <p class="message">
              You asked for a password change.<br />
              Please enter the following key in the application :
            </p>
            <div class="token" style="color: transparent; user-select: none;" onmouseover="this.style.color='#2a7ae2'">
              ${resetToken}
            </div>
          </div>
        </body>
      </html>
    `;
    }
    return mailContent;
  }

  /**
   * Creates an email object configured for sending a password reset request.
   * The email content and subject are localized based on the specified locale.
   * @param mailContent - The content of the email.
   * @param email - The recipient's email address.
   * @param locale - The language locale for the email subject, defaults to French ('fr').
   * @returns An `IEmail` object configured with the specified recipient, subject, and content.
   */
  private createEmail(
    mailContent: string,
    email: string,
    locale: string = 'fr',
  ): IEmail {
    let subject = '';
    if (locale == 'fr') {
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

export default LoginScreenManager;
