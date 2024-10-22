// Enums
import DocumentLogAction from '../../model/enums/DocumentLogAction';
import UserType from '../../model/enums/UserType';
// Models
import IDocument from '../../model/IDocument';
import { IDocumentActivityLogInput } from '../../model/IDocumentActivityLog';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';

import DocumentActivityLogsService from '../../services/DocumentActivityLogsService';

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

  /**
   * Logs the activity of opening a document by the current user.
   * @param currentUser - The user who is opening the document (optional).
   * @param currentClient - The client on behalf of whom the document is being opened (optional).
   * @param document - The document being opened.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves when the log entry is successfully recorded.
   * @throws If an error occurs while logging the document opening activity.
   */
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
