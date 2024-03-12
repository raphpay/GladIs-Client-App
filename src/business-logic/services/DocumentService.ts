import IDocument from '../model/IDocument';
import IFile from '../model/IFile';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing documents.
 */
class DocumentService {
  private static instance: DocumentService | null = null;
  private baseRoute = 'documents';

  private constructor() {}

  /**
   * Gets the singleton instance of the DocumentService class.
   * @returns The singleton instance of the DocumentService class.
   */
  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  /**
   * Retrieves the documents at the specified path.
   * @param path - The path to retrieve the documents from.
   * @returns A promise that resolves to an array of documents.
   * @throws If an error occurs while retrieving the documents.
   */
  async getDocumentsAtPath(path: string, token: IToken | null): Promise<IDocument[]> {
    try {
      const url = `${this.baseRoute}/getDocumentsAtPath`;
      const documents = await APIService.post<IDocument[]>(url, { value: path }, token?.value as string);
      return documents;
    } catch (error) {
      console.error('Error getting documents at path:', path, error);
      throw error;
    }
  }

  /**
   * Downloads the document with the specified ID.
   * @param id - The ID of the document to download.
   * @returns A promise that resolves to the downloaded document.
   * @throws If an error occurs while downloading the document.
   */
  async download(id: string, token: IToken | null): Promise<any> {
    try {
      const url = `${this.baseRoute}/download/${id}`;
      return await APIService.download(url, token?.value as string);
    } catch (error) {
      console.error('Error downloading document at id:', id, error);
      throw error;
    }
  }

  /**
   * Uploads a file as a document.
   * @param file - The file to upload.
   * @param name - The name of the document.
   * @param path - The path to upload the document to.
   * @returns A promise that resolves to the uploaded document.
   * @throws If an error occurs while uploading the document.
   */
  async upload(file: IFile, name: string, path: string, token: IToken | null): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>('documents', params, token?.value as string);
      return response as IDocument;
    } catch (error) {
      console.error('Error uploading document', name, 'at path', path, error);
      throw error;
    }
  }
}

export default DocumentService;
