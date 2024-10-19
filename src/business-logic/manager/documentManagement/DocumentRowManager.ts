import DocumentLogAction from '../../model/enums/DocumentLogAction';
import UserType from '../../model/enums/UserType';
import IDocument from '../../model/IDocument';
import { IDocumentActivityLogInput } from '../../model/IDocumentActivityLog';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';

import DocumentActivityLogsService from '../../services/DocumentActivityLogsService';
import DocumentServiceGet from '../../services/DocumentService/DocumentService.get';

class DocumentRowManager {
  private static instance: DocumentRowManager;

  private constructor() {}

  // Singleton
  static getInstance(): DocumentRowManager {
    if (!DocumentRowManager.instance) {
      DocumentRowManager.instance = new DocumentRowManager();
    }
    return DocumentRowManager.instance;
  }

  async loadSubDocuments(
    document: IDocument,
    token: IToken | null,
  ): Promise<IDocument[]> {
    let files: IDocument[] = [];
    try {
      files = await DocumentServiceGet.getDocumentPagesByNameAndPath(
        document.name,
        document.path,
        token,
      );
      return files;
    } catch (error) {
      throw error;
    }
  }

  async logDocumentOpening(
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
    document: IDocument,
    token: IToken | null,
  ) {
    try {
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Visualisation,
        actorIsAdmin: currentUser?.userType == UserType.Admin,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: document.id,
      };
      await DocumentActivityLogsService.getInstance().recordLog(
        logInput,
        token,
      );
    } catch (error) {
      throw error;
    }
  }
}

export default DocumentRowManager;
