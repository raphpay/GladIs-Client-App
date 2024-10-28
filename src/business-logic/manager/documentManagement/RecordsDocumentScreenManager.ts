import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
// Enums
import DocumentLogAction from '../../model/enums/DocumentLogAction';
import MimeType from '../../model/enums/MimeType';
import PlatformName from '../../model/enums/PlatformName';
// Model
import IDocument from '../../model/IDocument';
import { IDocumentActivityLogInput } from '../../model/IDocumentActivityLog';
import IFile from '../../model/IFile';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';
// Modules
import FileOpenPicker from '../../modules/FileOpenPicker';
import FinderModule from '../../modules/FinderModule';
const { FilePickerModule } = NativeModules;
// Services
import DocumentActivityLogsService from '../../services/DocumentActivityLogsService';
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';

class RecordsDocumentScreenManager {
  private static instance: RecordsDocumentScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): RecordsDocumentScreenManager {
    if (!RecordsDocumentScreenManager.instance) {
      RecordsDocumentScreenManager.instance =
        new RecordsDocumentScreenManager();
    }
    return RecordsDocumentScreenManager.instance;
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
   * Prompts the user to pick a PDF file from their device and returns the file's path.
   * The implementation varies depending on the platform (Mac, Android, or Windows).
   * @returns A promise that resolves to a string representing the path of the selected file.
   * @throws If an error occurs during the file selection process.
   */
  async pickFile(): Promise<string> {
    let originPath: string = '';
    try {
      if (Platform.OS === PlatformName.Mac) {
        originPath = await FinderModule.getInstance().pickPDFFilePath();
      } else if (Platform.OS === PlatformName.Android) {
        const file = await FilePickerModule.pickSingleFile([MimeType.pdf]);
        originPath = file.uri;
      } else if (Platform.OS === PlatformName.Windows) {
        const filePath = await FileOpenPicker?.readPDFFileData();
        if (filePath) {
          originPath = filePath;
        }
      }
    } catch (error) {
      throw error;
    }
    return originPath;
  }

  /**
   * Prompts the user to pick a PDF file specifically for Windows and returns the file's data.
   * @returns A promise that resolves to a string representing the path of the selected file, or undefined if no file is selected.
   */
  async pickWindowsFile(): Promise<string | undefined> {
    let data: string | undefined;
    data = await FileOpenPicker?.readPDFFileData();
    return data;
  }

  /**
   * Uploads a file to the API using the specified parameters.
   *
   * @param fileName - The name of the file to be uploaded.
   * @param originPath - The local path of the file to be uploaded.
   * @param documentDestinationPath - The destination path on the server where the document will be stored.
   * @param token - An optional token for authentication.
   *
   * @returns A promise that resolves to an IDocument object representing the created document.
   * @throws If an error occurs during the upload process.
   */
  async uploadFileToAPI(
    fileName: string,
    originPath: string,
    documentDestinationPath: string,
    token: IToken | null,
  ): Promise<IDocument> {
    try {
      const createdDocument = await DocumentServicePost.upload(
        fileName,
        originPath,
        documentDestinationPath,
        token,
      );
      return createdDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads file data in Base64 format to the API.
   *
   * @param data - The Base64 encoded file data to be uploaded. Can be undefined.
   * @param fileName - The name of the file to be uploaded.
   * @param destinationPath - The destination path on the server where the document will be stored.
   * @param token - An optional token for authentication.
   *
   * @returns A promise that resolves to an IDocument object representing the uploaded document, or undefined if no data was provided.
   */
  async uploadFileDataToAPI(
    data: string | undefined,
    fileName: string,
    destinationPath: string,
    token: IToken | null,
  ): Promise<IDocument | undefined> {
    if (data) {
      try {
        const file: IFile = {
          data,
          filename: fileName,
        };
        const doc = await DocumentServicePost.uploadViaBase64Data(
          file,
          fileName,
          destinationPath,
          token,
        );
        return doc;
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Records a log entry for a document activity.
   *
   * @param currentUser - The user performing the action. This parameter can be undefined.
   * @param currentClient - The client associated with the action. This parameter can be undefined.
   * @param createdDocument - The document that is the subject of the log entry.
   * @param token - An optional authentication token for the request.
   *
   * @returns A promise that resolves when the log entry is successfully recorded.
   * @throws If an error occurs while attempting to record the log.
   */
  async recordLog(
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
    createdDocument: IDocument,
    token: IToken | null,
  ) {
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Creation,
      actorIsAdmin: true,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID: createdDocument.id,
    };
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
  }
}

export default RecordsDocumentScreenManager;
