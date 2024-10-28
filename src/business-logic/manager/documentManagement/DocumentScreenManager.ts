import DocumentLogAction from '../../model/enums/DocumentLogAction';
import UserType from '../../model/enums/UserType';
import IDocument from '../../model/IDocument';
import { IDocumentActivityLogInput } from '../../model/IDocumentActivityLog';
import IFile from '../../model/IFile';
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
   * Uploads a file using form data to a specified path and records the document activity.
   * @param originPath - The original path or URI of the file to upload.
   * @param fileName - The name to assign to the uploaded file.
   * @param destinationPath - The path where the file should be uploaded.
   * @param token - An optional authentication token for the upload request.
   * @param currentUser - The user who is performing the upload action.
   * @param currentClient - The client associated with the upload action.
   * @returns A promise that resolves to an `IDocument` object representing the uploaded document.
   * @throws If an error occurs during the upload or activity logging process.
   */
  async uploadFormData(
    originPath: string,
    fileName: string,
    destinationPath: string,
    token: IToken | null,
    currentUser: IUser | undefined,
    currentClient: IUser | undefined,
  ): Promise<IDocument> {
    try {
      const createdDocument =
        await DocumentScreenManager.getInstance().uploadFileToAPI(
          originPath,
          fileName,
          destinationPath,
          token,
        );
      await DocumentScreenManager.getInstance().recordDocumentActivity(
        DocumentLogAction.Creation,
        currentUser,
        currentClient,
        createdDocument.id,
        token,
        true,
      );
      return createdDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a file using base64 data to a specified path.
   * @param data - The base64-encoded string representing the file data.
   * @param fileName - The name to assign to the uploaded file.
   * @param destinationPath - The path where the file should be uploaded.
   * @param token - An optional authentication token for the upload request.
   * @returns A promise that resolves to an `IDocument` object representing the uploaded document.
   * @throws If an error occurs during the upload process.
   */
  async uploadViaBase64Data(
    data: string,
    fileName: string,
    destinationPath: string,
    token: IToken | null,
  ): Promise<IDocument> {
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
