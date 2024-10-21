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

  /**
   * Uploads a file to an API by specifying the origin path, file name, and destination path.
   * The token is used for authentication during the upload process.
   *
   * @param originPath - The file's path on the local device.
   * @param fileName - The name of the file to upload.
   * @param destinationPath - The path on the server where the file will be uploaded.
   * @param token - The authentication token for the API (can be null).
   * @returns A promise that resolves to an `IDocument` object representing the uploaded file.
   * @throws Will throw an error if the upload fails.
   */
  async uploadFileToAPI(
    originPath: string,
    fileName: string,
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
   * Records an activity log for a document, tracking user actions such as viewing, editing, or sharing a document.
   * The log contains details such as the action performed, the user acting, and whether the user is an admin.
   *
   * @param action - The action performed on the document (e.g., view, edit, download).
   * @param currentUser - The user currently performing the action.
   * @param currentClient - The client associated with the action (if applicable).
   * @param documentID - The ID of the document being logged.
   * @param token - The authentication token for the API (can be null).
   * @param actorIsAdmin - Optional flag indicating if the actor is an admin (if null or undefined, the method will infer this from the currentUser's userType).
   * @returns A promise that resolves when the document activity log is successfully recorded.
   */
  async recordDocumentActivity(
    action: DocumentLogAction,
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
    documentID: string,
    token: IToken | null,
    actorIsAdmin?: boolean | null,
  ): Promise<void> {
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
