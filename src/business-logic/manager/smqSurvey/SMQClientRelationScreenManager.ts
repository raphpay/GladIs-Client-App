import { NativeModules, Platform } from 'react-native';
// Enums
import DocumentLogAction from '../../model/enums/DocumentLogAction';
import PlatformName from '../../model/enums/PlatformName';
// Models
import IDocument from '../..//model/IDocument';
import MimeType from '../../model/enums/MimeType';
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

class SMQClientRelationScreenManager {
  private static instance: SMQClientRelationScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): SMQClientRelationScreenManager {
    if (!SMQClientRelationScreenManager.instance) {
      SMQClientRelationScreenManager.instance =
        new SMQClientRelationScreenManager();
    }
    return SMQClientRelationScreenManager.instance;
  }

  /**
   * Picks a PDF file from the user's file system.
   *
   * This method allows the user to select a PDF file from their device.
   * It handles different platforms (Mac and Android) and returns the
   * file's local path.
   *
   * @returns A promise that resolves with the local file path of the
   *          selected PDF file.
   * @throws If an error occurs during the file picking process.
   */
  async pickFile(): Promise<string> {
    let originPath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      originPath = await FinderModule.getInstance().pickPDFFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      const file = await FilePickerModule.pickSingleFile([MimeType.pdf]);
      originPath = file.uri;
    }
    return originPath;
  }

  /**
   * Picks a PDF file on Windows.
   *
   * This method allows the user to select a PDF file from their device
   * specifically for Windows users. It returns the file's local path.
   *
   * @returns A promise that resolves with the local file path of the
   *          selected PDF file, or undefined if no file was selected.
   * @throws If an error occurs during the file picking process.
   */
  async pickWindowsFile(): Promise<string | undefined> {
    let data: string | undefined;
    data = await FileOpenPicker?.readPDFFileData();
    return data;
  }

  /**
   * Uploads a file to the API.
   *
   * This method uploads a file using the provided file name, local origin path,
   * destination path, and authentication token. It returns the created document
   * object upon successful upload.
   *
   * @param fileName - The name of the file being uploaded.
   * @param originPath - The local path of the file to be uploaded.
   * @param destinationPath - The path on the server where the file should be stored.
   * @param token - The authentication token for API access (can be null).
   * @returns A promise that resolves with the document object representing
   *          the uploaded file.
   * @throws If an error occurs during the upload process.
   */
  async uploadFileToAPI(
    fileName: string,
    originPath: string,
    destinationPath: string,
    token: IToken | null,
  ): Promise<IDocument> {
    try {
      const createdDocument = await DocumentServicePost.upload(
        fileName,
        originPath,
        destinationPath,
        token,
      );
      return createdDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads file data to the API using base64 encoding.
   *
   * This method allows for uploading a file's data as a base64 string to the API.
   * It constructs a file object and calls the API to perform the upload.
   *
   * @param data - The base64 encoded data of the file to be uploaded.
   *               If undefined, the upload will not proceed.
   * @param fileName - The name of the file being uploaded.
   * @param destinationPath - The path on the server where the file should be stored.
   * @param token - The authentication token for API access (can be null).
   * @returns A promise that resolves with the document object representing
   *          the uploaded file, or undefined if data was not provided.
   * @throws If an error occurs during the upload process.
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
   * Logs the creation of a document.
   *
   * This method records an activity log entry for the creation of a document.
   * It constructs the log input and calls the logging service to persist the entry.
   *
   * @param currentUser - The user performing the action (optional).
   * @param currentClient - The client associated with the action (optional).
   * @param document - The document that was created.
   * @param token - The authentication token for API access (can be null).
   * @throws If an error occurs during the logging process.
   */
  async logDocumentCreation(
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
    document: IDocument,
    token: IToken | null,
  ) {
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Creation,
      actorIsAdmin: true,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID: document.id,
    };
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
  }
}

export default SMQClientRelationScreenManager;
