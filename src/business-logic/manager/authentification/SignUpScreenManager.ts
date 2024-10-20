import MimeType from '../../model/enums/MimeType';
import IDocument from '../../model/IDocument';
import IPotentialEmployee from '../../model/IPotentialEmployee';
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
