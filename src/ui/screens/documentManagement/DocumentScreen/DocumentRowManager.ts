import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import UserType from '../../../../business-logic/model/enums/UserType';
import IDocument from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IToken from '../../../../business-logic/model/IToken';
import IUser from '../../../../business-logic/model/IUser';

import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentServiceGet from '../../../../business-logic/services/DocumentService/DocumentService.get';

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
