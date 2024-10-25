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

// TODO: - Correct this screen errors
// TODO: - Add documentation
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

  async updateUserConnectionAttempts(
    identifier: string,
  ): Promise<ILoginTryOutput> {
    try {
      const output = await UserServicePost.getUserLoginTryOutput(identifier);
      const tryAttempsCount = await UserServicePut.blockUserConnection(
        output.id as string,
      );
      output.connectionFailedAttempts = tryAttempsCount;
      return output;
    } catch (error) {
      throw error;
    }
  }

  async handleTryAttemptCount(tryOutput: ILoginTryOutput) {
    const count = tryOutput.connectionFailedAttempts || 0;
    if (count >= 5) {
      if (count === 5) {
        sendMaxLoginEvent(tryOutput);
      }
      displayToast(t('errors.api.unauthorized.login.connectionBlocked'), true);
    } else {
      displayToast(t('errors.api.unauthorized.login'), true);
    }
  }

  async sendMaxLoginEvent(tryOutput: ILoginTryOutput) {
    try {
      const event: IEventInput = {
        name: `${t('login.tooManyAttempts.eventName')} ${identifier} : ${
          tryOutput.email
        }`,
        date: Date.now(),
        clientID: tryOutput.id ?? '0',
      };
      await EventServicePost.createMaxAttemptsEvent(event);
    } catch (error) {
      console.log('Error sending max attempts event', error);
    }
  }

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
