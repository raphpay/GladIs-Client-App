import DocumentLogAction from '../../model/enums/DocumentLogAction';
import UserType from '../../model/enums/UserType';
import IDocument from '../../model/IDocument';
import { IDocumentActivityLogInput } from '../../model/IDocumentActivityLog';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';

import DocumentActivityLogsService from '../../services/DocumentActivityLogsService';
import DocumentServicePost from '../../services/DocumentService/DocumentService.post';

class DocumentScreenManager {
  private static instance: DocumentScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): DocumentScreenManager {
    if (!DocumentScreenManager.instance) {
      DocumentScreenManager.instance = new DocumentScreenManager();
    }
    return DocumentScreenManager.instance;
  }

  async uploadFileToAPI(
    originPath: string,
    fileName: string,
    destinationPath: string,
    token: IToken | null,
  ): Promise<IDocument[]> {
    try {
      const createdDocuments = await DocumentServicePost.upload(
        fileName,
        originPath,
        destinationPath,
        token,
      );
      return createdDocuments;
    } catch (error) {
      throw error;
    }
  }

  async recordDocumentActivity(
    action: DocumentLogAction,
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
    documentID: string,
    token: IToken | null,
    actorIsAdmin?: boolean | null,
  ) {
    const logInput: IDocumentActivityLogInput = {
      action,
      actorIsAdmin: actorIsAdmin || currentUser?.userType == UserType.Admin,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID,
    };
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
  }
}

export default DocumentScreenManager;
