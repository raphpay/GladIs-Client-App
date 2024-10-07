import { IEmail } from "../../model/IEmail";
import IToken from "../../model/IToken";
import IUser from "../../model/IUser";
import EmailService from "../../services/EmailService";
import { BASE_PASSWORD, FROM_MAIL, FROM_NAME, SEND_GRID_API_KEY } from "../../utils/envConfig";

/**
 * A class to handle client creation screen logic
 */
class ClientCreationManager {
  private static instance: ClientCreationManager;

  private constructor() {}

  // Singleton
  static getInstance(): ClientCreationManager {
    if (!ClientCreationManager.instance) {
      ClientCreationManager.instance = new ClientCreationManager();
    }
    return ClientCreationManager.instance;
  }


  // Async Methods
  async sendEmail(user: IUser, token: IToken | null) {
    const employeeEmail = this.createEmail(user.username || 'no.username', user.email);
    await EmailService.getInstance().sendEmail(employeeEmail, token);
  }
  
  // Private Sync Methods
  private createEmail(username: string, email: string): IEmail {
    // Generate password
    const generatedPassword = BASE_PASSWORD //TODO: Generate password
    // TODO: Make sure the password is not seen in the first line of the mail
    const mailContent = `Hello, and welcome.\n Your credentials are : ${username} and ${generatedPassword}`

    const sendGridEmail: IEmail = {
      to: [email],
      fromMail: FROM_MAIL,
      fromName: FROM_NAME,
      replyTo: FROM_MAIL,
      subject: 'Welcome to GladIs',
      content: mailContent,
      apiKey: SEND_GRID_API_KEY,
    }

    return sendGridEmail;
  }
}

export default ClientCreationManager;
