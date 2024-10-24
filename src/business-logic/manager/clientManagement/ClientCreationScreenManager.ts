// Model
import { PermissionsAndroid } from 'react-native';
// Enums
import MimeType from '../../model/enums/MimeType';
import PendingUserStatus from '../../model/enums/PendingUserStatus';
// Model
import IDocument from '../../model/IDocument';
import { IEmail } from '../../model/IEmail';
import IModule from '../../model/IModule';
import IPendingUser from '../../model/IPendingUser';
import IPotentialEmployee from '../../model/IPotentialEmployee';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';
// Services
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';
import EmailService from '../../services/EmailService';
import PendingUserServicePost from '../../services/PendingUserService/PendingUserService.post';
import PotentialEmployeeService from '../../services/PotentialEmployeeService';
import UserServicePut from '../../services/UserService/UserService.put';
// Utils
import { FROM_MAIL, FROM_NAME, SEND_GRID_API_KEY } from '../../utils/envConfig';
import Utils from '../../utils/Utils';

/**
 * A class to handle client creation screen logic
 */
class ClientCreationScreenManager {
  private static instance: ClientCreationScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): ClientCreationScreenManager {
    if (!ClientCreationScreenManager.instance) {
      ClientCreationScreenManager.instance = new ClientCreationScreenManager();
    }
    return ClientCreationScreenManager.instance;
  }

  // Async Methods
  async sendEmail(
    user: IUser,
    employees: IUser[] | undefined,
    token: IToken | null,
  ) {
    const generatedPassword = Utils.generatePassword(8);
    const mailContent =
      ClientCreationScreenManager.getInstance().generateMailContent(
        user.username,
        employees,
        generatedPassword,
      );

    const employeeEmail = this.createEmail(mailContent, user.email);
    await EmailService.getInstance().sendEmail(employeeEmail, token);
  }

  async createPendingUser(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    companyName: string,
    email: string,
    products: string,
    employees: string,
    numberOfUsers: string,
    sales: string,
    status: PendingUserStatus,
    selectedModules: IModule[],
  ): Promise<IPendingUser> {
    const newPendingUser: IPendingUser = {
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      products,
      numberOfEmployees: parseInt(employees),
      numberOfUsers: parseInt(numberOfUsers),
      salesAmount: parseFloat(sales),
      status: PendingUserStatus.pending,
    };
    let createdUser: IPendingUser | undefined;
    try {
      createdUser = await PendingUserServicePost.askForSignUp(
        newPendingUser,
        selectedModules,
      );
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async createEmployees(
    potentialEmployees: IPotentialEmployee[],
    pendingUserID: string,
  ) {
    // Update all employees with pendingUserID
    const updatedPotentialEmployees = potentialEmployees.map(employee => {
      return {
        ...employee,
        pendingUserID,
      };
    });
    for (const employee of updatedPotentialEmployees) {
      if (employee.pendingUserID !== null) {
        try {
          await PotentialEmployeeService.getInstance().create(employee);
        } catch (error) {
          throw error;
        }
      }
    }
  }

  async convertPendingUser(
    pendingUser: IPendingUser,
    token: IToken | null,
  ): Promise<IUser> {
    const id = pendingUser?.id as string;
    const castedToken = token as IToken;
    let createdUser: IUser | undefined;

    try {
      createdUser = await PendingUserServicePost.convertPendingUserToUser(
        id,
        castedToken,
      );
    } catch (error) {
      throw error;
    }

    return createdUser;
  }

  async convertEmployeesToUser(
    potentialEmployees: IPotentialEmployee[],
    manager: IUser,
    selectedModules: IModule[],
    token: IToken | null,
  ): Promise<IUser[]> {
    const newUsers: IUser[] = [];
    for (const employee of potentialEmployees) {
      try {
        const newUserEmployee =
          await PotentialEmployeeService.getInstance().convertToUser(
            employee.id as string,
            token,
          );
        newUsers.push(newUserEmployee);
      } catch (error) {
        throw error;
      }
    }

    for (const employee of newUsers) {
      await UserServicePut.addManagerToUser(
        employee.id as string,
        manager.id as string,
        token,
      );
      await UserServicePut.updateModules(
        employee.id as string,
        selectedModules,
        token,
      );
    }

    return newUsers;
  }

  async uploadLogo(
    destinationPath: string,
    imageOriginPath: string | null,
  ): Promise<IDocument | undefined> {
    if (imageOriginPath) {
      try {
        const fileName = 'logo.png';
        const doc = await DocumentServicePost.uploadLogoFormData(
          fileName,
          imageOriginPath,
          destinationPath,
          MimeType.png,
        );
        return doc;
      } catch (error) {
        throw error;
      }
    }
  }

  async askAndroidPermission(
    title: string,
    message: string,
    buttonNeutral: string,
    buttonNegative: string,
    buttonPositive: string,
  ): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title,
          message,
          buttonNeutral,
          buttonNegative,
          buttonPositive,
        },
      );
      return granted === 'granted' ? true : false;
    } catch (error) {
      throw error;
    }
  }

  // Private Sync Methods
  private generateMailContent(
    username: string | undefined,
    employeeUsernames: IUser[] | undefined,
    generatedPassword: string,
    locale: string = 'fr',
  ) {
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
        mailContent =
          "Nous avons rencontré un problème avec votre nom d'utilisateur. Veuillez contacter votre fournisseur.";
      } else {
        mailContent =
          'We encountered a problem with your username. Please contact your provider.';
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
    };

    return sendGridEmail;
  }
}

export default ClientCreationScreenManager;
