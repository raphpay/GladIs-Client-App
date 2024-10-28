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

// TODO: Add documentation
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

  async pickWindowsFile(): Promise<string | undefined> {
    let data: string | undefined;
    data = await FileOpenPicker?.readPDFFileData();
    return data;
  }

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
      } catch (error) {}
    }
  }

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
