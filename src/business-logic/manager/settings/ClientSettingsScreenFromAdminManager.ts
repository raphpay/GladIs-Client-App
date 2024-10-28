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

  /**
   * Prompts the user to pick an image file for use as a logo.
   *
   * This method determines the platform and uses the appropriate module
   * to allow the user to select an image file. It supports Mac and Android platforms.
   *
   * @returns A promise that resolves with the file path of the selected image file.
   *          If no file is selected, an empty string is returned.
   * @throws If an error occurs while trying to pick the file.
   */
  async pickLogo(): Promise<string> {
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickImageFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      filePath = await FilePickerModule.pickSingleFile([MimeType.csv]);
    }
    return filePath;
  }

  /**
   * Prompts the user to pick an image file for use as a logo on Windows.
   *
   * This method uses the FileOpenPicker to allow the user to select an image file.
   *
   * @returns A promise that resolves with the file path of the selected image file.
   *          If no file is selected, undefined is returned.
   * @throws If an error occurs while trying to pick the file.
   */
  async pickLogoForWindows(): Promise<string | undefined> {
    let data: string | undefined;
    data = await FileOpenPicker?.readImageFileData();
    return data;
  }

  /**
   * Uploads a logo file to the API.
   *
   * This method uploads a logo file by using the specified name, origin path,
   * and destination path. It sets the MIME type to PNG.
   *
   * @param name - The name of the logo file to be uploaded.
   * @param originPath - The local file path of the logo to be uploaded.
   * @param destinationPath - The path on the server where the logo should be stored.
   * @returns A promise that resolves with the document object representing the uploaded logo.
   * @throws If an error occurs during the upload process.
   */
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

  /**
   * Uploads image data to the API using base64 encoding.
   *
   * This method uploads an image represented by a base64 string. If the data is provided,
   * it constructs a file object and uploads it to the specified destination path.
   *
   * @param data - The base64 string of the image data to be uploaded.
   * @param fileName - The name of the file to be uploaded.
   * @param destinationPath - The path on the server where the image should be stored.
   * @returns A promise that resolves with the document object representing the uploaded image,
   *          or undefined if the data was not provided.
   * @throws If an error occurs during the upload process.
   */
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

  /**
   * Stores cached values related to a client's logo.
   *
   * This method stores the document ID of the logo and the last modified date in the cache.
   *
   * @param currentClient - The current client whose logo information is being cached.
   * @param documentID - The document ID of the logo to be cached.
   * @returns A promise that resolves when the values have been successfully stored in the cache.
   * @throws If an error occurs during the caching process.
   */
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
