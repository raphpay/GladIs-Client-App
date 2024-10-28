import { PermissionsAndroid } from 'react-native';
// Enums
import MimeType from '../../model/enums/MimeType';
// Model
import IDocument from '../../model/IDocument';
import IPotentialEmployee from '../../model/IPotentialEmployee';
// Services
import IFile from '../../model/IFile';
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';
import PotentialEmployeeService from '../../services/PotentialEmployeeService';

/**
 * A class to handle sign up screen logic
 */
class SignUpScreenManager {
  private static instance: SignUpScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): SignUpScreenManager {
    if (!SignUpScreenManager.instance) {
      SignUpScreenManager.instance = new SignUpScreenManager();
    }
    return SignUpScreenManager.instance;
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
  ): Promise<boolean | undefined> {
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

  /**
   * Uploads a logo image to the specified destination path.
   * @param destinationPath - The path where the logo should be uploaded.
   * @param imageOriginPath - The local path of the image file to upload.
   * @returns A promise that resolves to the uploaded `IDocument` object, or undefined if no image path is provided.
   * @throws If an error occurs during the logo upload process.
   */
  async uploadLogo(
    destinationPath: string,
    imageOriginPath?: string | null,
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
      const fileName = 'logo.png';
      try {
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
          console.log('Error creating potential employee:', employee, error);
        }
      }
    }
  }
}

export default SignUpScreenManager;
