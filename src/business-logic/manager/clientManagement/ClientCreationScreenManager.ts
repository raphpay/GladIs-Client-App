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

// TODO: Add documentation
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
    locale: string = 'fr',
  ) {
    const generatedPassword = Utils.generatePassword(8);
    const mailContent =
      ClientCreationScreenManager.getInstance().generateMailContent(
        user.username,
        employees,
        generatedPassword,
        locale,
      );

    const employeeEmail = this.createEmail(mailContent, user.email, locale);
    await EmailService.getInstance().sendEmail(employeeEmail);
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
    pendingUser: IPendingUser | null | undefined,
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
    if (username) {
      if (locale === 'fr') {
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
                .credentials {
                  margin-top: 15px;
                }
                .credential-item {
                  margin-top: 10px;
                  font-weight: bold;
                  color: #333;
                }
                .password {
                  color: transparent;
                  background-color: #f0f0f0;
                  padding: 5px 10px;
                  border-radius: 5px;
                  display: inline-block;
                  user-select: none;
                }
                .password:hover {
                  color: #e63946;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <p class="title">Bonjour, et bienvenue!</p>
                <p class="message">
                  Vos identifiants sont:
                </p>
                <div class="credentials">
                  <div class="credential-item">
                    <strong>Nom d'utilisateur:</strong> ${username}
                  </div>
                  <div class="credential-item">
                    <strong>Mot de passe provisoire:</strong> 
                    <span class="password" onmouseover="this.style.color='#e63946'">
                      ${generatedPassword}
                    </span>
                  </div>
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
              .credentials {
                margin-top: 15px;
              }
              .credential-item {
                margin-top: 10px;
                font-weight: bold;
                color: #333;
              }
              .password {
                color: transparent;
                background-color: #f0f0f0;
                padding: 5px 10px;
                border-radius: 5px;
                display: inline-block;
                user-select: none;
              }
              .password:hover {
                color: #e63946;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p class="title">Hello, and welcome!</p>
              <p class="message">
                Your credentials are as follows:
              </p>
              <div class="credentials">
                <div class="credential-item">
                  <strong>Username:</strong> ${username}
                </div>
                <div class="credential-item">
                  <strong>Temporary password:</strong> 
                  <span class="password" onmouseover="this.style.color='#e63946'">
                    ${generatedPassword}
                  </span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
      }
      if (employeeUsernames) {
        for (const index in employeeUsernames) {
          const generatedPassword = Utils.generatePassword(8);
          mailContent += `
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
                  .employee-list {
                    margin-top: 20px;
                  }
                  .employee-item {
                    margin-top: 15px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #fff;
                  }
                  .employee-item strong {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                  }
                  .password {
                    color: transparent;
                    background-color: #f0f0f0;
                    padding: 5px 10px;
                    border-radius: 5px;
                    display: inline-block;
                    user-select: none;
                  }
                  .password:hover {
                    color: #e63946;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <p class="title">Bonjour,</p>
                  <p>Voici les informations des employés :</p>
                  <div class="employee-list">
          `;
          if (locale == 'fr') {
            mailContent += `
            <div class="employee-item">
              <strong>Employé ${index + 1}:</strong> ${
              employeeUsernames[index].username
            }<br />
              <strong>Mot de passe provisoire:</strong> 
              <span class="password" onmouseover="this.style.color='#e63946'">${generatedPassword}</span>
            </div>`;
          } else {
            mailContent += `
            <div class="employee-item">
              <strong>Employee ${index + 1}:</strong> ${
              employeeUsernames[index].username
            }<br />
              <strong>Temporary password:</strong> 
              <span class="password" onmouseover="this.style.color='#e63946'">${generatedPassword}</span>
            </div>`;
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

  private createEmail(
    mailContent: string,
    email: string,
    locale: string = 'fr',
  ): IEmail {
    let subject = '';
    if (locale === 'fr') {
      subject = 'Bienvenue à Glad-Is';
    } else {
      subject = 'Welcome to Glad-Is';
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

export default ClientCreationScreenManager;
