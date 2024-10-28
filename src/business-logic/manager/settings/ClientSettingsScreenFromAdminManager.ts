import { NativeModules, Platform } from 'react-native';
// Enums
import MimeType from '../../model/enums/MimeType';
import PlatformName from '../../model/enums/PlatformName';
// Models
import IDocument from '../../model/IDocument';
import IFile from '../../model/IFile';
import IUser from '../../model/IUser';
import FileOpenPicker from '../../modules/FileOpenPicker';
import FinderModule from '../../modules/FinderModule';
// Modules
const { FilePickerModule } = NativeModules;
// Services
import CacheService from '../../services/CacheService';
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';

// TODO: Add documentation
/**
 * A class to handle client settings screen from admin logic
 */
class ClientSettingsScreenFromAdminManager {
  private static instance: ClientSettingsScreenFromAdminManager;

  private constructor() {}

  // Singleton
  static getInstance(): ClientSettingsScreenFromAdminManager {
    if (!ClientSettingsScreenFromAdminManager.instance) {
      ClientSettingsScreenFromAdminManager.instance =
        new ClientSettingsScreenFromAdminManager();
    }
    return ClientSettingsScreenFromAdminManager.instance;
  }

  async pickLogo(): Promise<string> {
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickImageFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      filePath = await FilePickerModule.pickSingleFile([MimeType.csv]);
    }
    return filePath;
  }

  async pickLogoForWindows(): Promise<string | undefined> {
    let data: string | undefined;
    data = await FileOpenPicker?.readImageFileData();
    return data;
  }

  async uploadToAPI(
    name: string,
    originPath: string,
    destinationPath: string,
  ): Promise<IDocument> {
    try {
      const doc = await DocumentServicePost.uploadLogoFormData(
        name,
        originPath,
        destinationPath,
        MimeType.png,
      );
      return doc;
    } catch (error) {
      throw error;
    }
  }

  async uploadDataToAPI(
    data: string | undefined,
    fileName: string,
    destinationPath: string,
  ): Promise<IDocument | undefined> {
    if (data) {
      try {
        const file: IFile = {
          data,
          filename: fileName,
        };
        const doc = await DocumentServicePost.uploadImageViaBase64Data(
          file,
          fileName,
          destinationPath,
        );
        return doc;
      } catch (error) {
        throw error;
      }
    }
  }

  async storeCachedValues(
    currentClient: IUser | undefined,
    documentID: string,
  ) {
    await CacheService.getInstance().storeValue(
      `${currentClient?.id}/logo/id`,
      documentID,
    );
    await CacheService.getInstance().storeValue(
      `${currentClient?.id}/logo-lastModified`,
      new Date(),
    );
  }
}

export default ClientSettingsScreenFromAdminManager;
