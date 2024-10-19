import { NativeModules, Platform } from 'react-native';
const { FilePickerModule } = NativeModules;

import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import PlatformName from '../../../../business-logic/model/enums/PlatformName';

import IDocument from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IToken from '../../../../business-logic/model/IToken';
import IUser from '../../../../business-logic/model/IUser';

import FinderModule from '../../../../business-logic/modules/FinderModule';

import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentServicePost from '../../../../business-logic/services/DocumentService/DocumentService.post';

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

  async pickFile(): Promise<string> {
    let originPath: string = '';
    try {
      if (Platform.OS === PlatformName.Mac) {
        originPath = await FinderModule.getInstance().pickPDFFilePath();
      } else if (Platform.OS === PlatformName.Android) {
        const file = await FilePickerModule.pickSingleFile(['application/pdf']);
        originPath = file.uri;
      }
    } catch (error) {
      throw error;
    }
    return originPath;
  }

  async uploadFileToAPI(
    fileName: string,
    originPath: string,
    documentDestinationPath: string,
    token: IToken | null,
  ): Promise<IDocument[]> {
    try {
      const createdDocuments = await DocumentServicePost.uploadFormDataFile(
        fileName,
        originPath,
        documentDestinationPath,
        token,
      );
      return createdDocuments;
    } catch (error) {
      throw error;
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
