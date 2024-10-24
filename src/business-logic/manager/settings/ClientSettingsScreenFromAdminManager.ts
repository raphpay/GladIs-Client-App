import { NativeModules, Platform } from 'react-native';
// Enums
import MimeType from '../../model/enums/MimeType';
import PlatformName from '../../model/enums/PlatformName';
// Models
import IDocument from '../../model/IDocument';
import IUser from '../../model/IUser';
import FileOpenPicker from '../../modules/FileOpenPicker';
import FinderModule from '../../modules/FinderModule';
// Modules
const { FilePickerModule } = NativeModules;
// Services
import CacheService from '../../services/CacheService';
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';

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
    } else if (Platform.OS === PlatformName.Windows) {
      const originPath = await FileOpenPicker?.pickPDFFile();
      if (originPath) {
        filePath = originPath;
      }
    }

    return filePath;
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
