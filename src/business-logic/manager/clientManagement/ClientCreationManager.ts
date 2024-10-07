// Model
import { IEmail } from "../../model/IEmail";
import IToken from "../../model/IToken";
import IUser from "../../model/IUser";
// Services
import EmailService from "../../services/EmailService";
// Utils
import { FROM_MAIL, FROM_NAME, SEND_GRID_API_KEY } from "../../utils/envConfig";
import Utils from "../../utils/Utils";

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
  async sendEmail(user: IUser, employees: IUser[] | undefined, token: IToken | null) {
    const generatedPassword = Utils.generatePassword(8);
    const mailContent = ClientCreationManager.getInstance().generateMailContent(user.username, employees, generatedPassword);

    const employeeEmail = this.createEmail(mailContent, user.email);
    await EmailService.getInstance().sendEmail(employeeEmail, token);
  }
  
  // Private Sync Methods
  private generateMailContent(username: string | undefined , employeeUsernames: IUser[] | undefined, generatedPassword: string, locale: string = 'fr') {
    let mailContent = '';
    // TODO: Make sure the content is in HTML.
    if (username) {
      mailContent = `Hello, and welcome.\n Your credentials are : ${username} and ${generatedPassword}`;
      if (employeeUsernames) {
        for (const index in employeeUsernames) {
          const generatedPassword = Utils.generatePassword(8);
          if (locale == 'fr') {
            mailContent += `\nEmployé ${index}: ${employeeUsernames[index].username}\nSon mot de passe provisoire est: ${generatedPassword}`;
          } else {
            mailContent += `\nEmployee ${index}: ${employeeUsernames[index].username}\nIts temporary password is ${generatedPassword}`;
          }
        }
      }
    } else {
      if (locale == 'fr') {
        mailContent = 'Nous avons rencontré un problème avec votre nom d\'utilisateur. Veuillez contacter votre fournisseur.'
      } else {
        mailContent = 'We encountered a problem with your username. Please contact your provider.'
      }
    }
    return mailContent;
  }
  
  private createEmail(mailContent: string, email: string): IEmail {
    const sendGridEmail: IEmail = {
      to: [email],
      fromMail: FROM_MAIL,
      fromName: FROM_NAME,
      replyTo: FROM_MAIL,
      subject: 'Welcome to GladIs',
      content: mailContent,
      apiKey: SEND_GRID_API_KEY,
      isHTML: true,
    }

    return sendGridEmail;
  }
}

export default ClientCreationManager;
