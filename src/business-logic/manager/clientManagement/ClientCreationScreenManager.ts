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
import IFile from '../../model/IFile';
import { FROM_MAIL, FROM_NAME } from '../../utils/envConfig';
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
  /**
   * Sends a welcome or onboarding email with a generated password to the specified user.
   * @param user - The user to whom the email will be sent.
   * @param employees - An optional list of employees associated with the user, used to personalize the email content.
   * @param locale - The language locale for the email content, default is French ('fr').
   * @returns A promise that resolves when the email is successfully sent.
   * @throws If an error occurs while generating or sending the email.
   */
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

  /**
   * Creates a new pending user with the provided details and initiates the sign-up process.
   * @param firstName - The first name of the pending user.
   * @param lastName - The last name of the pending user.
   * @param phoneNumber - The phone number of the pending user.
   * @param companyName - The company name associated with the pending user.
   * @param email - The email address of the pending user.
   * @param products - The products associated with the pending user.
   * @param employees - The number of employees associated with the pending user's organization.
   * @param numberOfUsers - The number of users to be created.
   * @param sales - The sales amount associated with the pending user.
   * @param status - The current status of the pending user, typically set to `PendingUserStatus.pending`.
   * @param selectedModules - The list of modules selected by the user.
   * @returns A promise that resolves to the created `IPendingUser` object.
   * @throws If an error occurs during the creation of the pending user.
   */
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

  /**
   * Creates employee records for each potential employee associated with a pending user ID.
   * @param potentialEmployees - An array of potential employees to be created.
   * @param pendingUserID - The ID of the pending user associated with these employees.
   * @returns A promise that resolves when all employees are successfully created.
   * @throws If an error occurs while creating any employee record.
   */
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

  /**
   * Converts a pending user to an active user, generating a new user record.
   * @param pendingUser - The pending user to be converted, or null/undefined if not available.
   * @param token - The authentication token required for authorization.
   * @returns A promise that resolves to the newly created `IUser` object.
   * @throws If an error occurs during the conversion of the pending user.
   */
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

  /**
   * Converts potential employees to active users, assigns a manager to each, and updates each with the specified modules.
   * @param potentialEmployees - An array of potential employees to be converted to users.
   * @param manager - The manager user to assign to each newly created user.
   * @param selectedModules - The modules to assign to each converted employee.
   * @param token - The authentication token required for authorization.
   * @returns A promise that resolves to an array of newly created `IUser` objects.
   * @throws If an error occurs during the conversion of any employee or while updating user details.
   */
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

  /**
   * Uploads a logo image to the specified destination path.
   * @param destinationPath - The path where the logo should be uploaded.
   * @param imageOriginPath - The local path of the image file to upload.
   * @returns A promise that resolves to the uploaded `IDocument` object, or undefined if no image path is provided.
   * @throws If an error occurs during the logo upload process.
   */
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

  /**
   * Uploads a logo image to the specified destination path using Base64-encoded data.
   * @param data - The Base64-encoded string representing the image data to upload.
   * @param destinationPath - The path where the logo should be uploaded.
   * @throws If an error occurs during the upload process.
   */
  async uploadLogoData(data: string | null, destinationPath: string) {
    if (data) {
      try {
        const fileName = 'logo.png';
        const file: IFile = {
          data,
          filename: fileName,
        };
        await DocumentServicePost.uploadImageViaBase64Data(
          file,
          fileName,
          destinationPath,
        );
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Requests camera permission from the user on an Android device.
   * @param title - The title of the permission dialog.
   * @param message - The message displayed in the permission dialog.
   * @param buttonNeutral - Text for the neutral button in the dialog.
   * @param buttonNegative - Text for the negative button in the dialog.
   * @param buttonPositive - Text for the positive button in the dialog.
   * @returns A promise that resolves to a boolean indicating if the permission was granted.
   * @throws If an error occurs while requesting the permission.
   */
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
      isHTML: true,
    };

    return sendGridEmail;
  }
}

export default ClientCreationScreenManager;
