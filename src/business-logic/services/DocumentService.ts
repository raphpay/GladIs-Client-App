import IDocument, { IDocumentPaginatedOutput } from '../model/IDocument';
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
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to an array of documents.
   * @throws If an error occurs while retrieving the documents.
   */
  async getDocumentsAtPath(path: string, token: IToken | null): Promise<IDocument[]> {
    try {
      const url = `${this.baseRoute}/getDocumentsAtPath`;
      const documents = await APIService.post<IDocument[]>(url, { value: path }, token?.value as string);
      return documents;
    } catch (error) {
      console.log('Error getting documents at path:', path, error);
      throw error;
    }
  }

  /**
   * Retrieves the paginated documents at the specified path.
   * @param path - The path to retrieve the documents from.
   * @param token - The authentication token (optional).
   * @param page - The page number.
   * @returns A promise that resolves to the paginated documents.
   * @throws If an error occurs while retrieving the documents.
   */
  async getPaginatedDocumentsAtPath(path: string, token: IToken | null, page: number, perPage: number): Promise<IDocumentPaginatedOutput> {
    try {
      const url = `${this.baseRoute}/paginated/path?page=${page}&perPage=${perPage}`;
      const output = await APIService.post<IDocumentPaginatedOutput>(url, { value: path }, token?.value as string);
      return output;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Downloads the document with the specified ID.
   * @param id - The ID of the document to download.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the downloaded document.
   * @throws If an error occurs while downloading the document.
   */
  async download(id: string, token: IToken | null): Promise<any> {
    try {
      const url = `${this.baseRoute}/download/${id}`;
      const data = await APIService.download(url, token?.value as string);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a file as a document.
   * @param file - The file to upload.
   * @param name - The name of the document.
   * @param path - The path to upload the document to.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the uploaded document.
   * @throws If an error occurs while uploading the document.
   */
  async upload(file: IFile, name: string, path: string, token: IToken | null): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(this.baseRoute, params, token?.value as string);
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a logo file.
   * @param file - The logo file to upload.
   * @param name - The name of the logo.
   * @param path - The path to upload the logo to.
   * @returns A promise that resolves to the uploaded logo document.
   * @throws If an error occurs while uploading the logo.
   */
  async uploadLogo(file: IFile, name: string, path: string): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(`${this.baseRoute}/logo`, params);
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the status of the document with the specified ID.
   * @param id - The ID of the document to update.
   * @param status - The new status of the document.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the updated document.
   * @throws If an error occurs while updating the status of the document.
   */
  async updateStatus(id: string, status: string, token: IToken | null): Promise<IDocument> {
    try {
      const response = await APIService.put(`${this.baseRoute}/${id}`, { status }, token?.value as string);
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Archives the document with the specified ID.
   * @param id - The ID of the document to archive.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the archived document.
   * @throws If an error occurs while archiving the document.
   */
  async archiveDocument(id: string, token: IToken | null): Promise<IDocument> {
    try {
      const updatedDocument = await APIService.get<IDocument>(`${this.baseRoute}/zip/${id}`, token?.value as string);
      return updatedDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unarchives the document with the specified ID.
   * @param id - The ID of the document to unarchive.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the unarchived document.
   * @throws If an error occurs while unarchiving the document.
   */
  async unarchiveDocument(id: string, token: IToken | null): Promise<IDocument> {
    try {
      const updatedDocument = await APIService.get<IDocument>(`${this.baseRoute}/unzip/${id}`, token?.value as string);
      return updatedDocument;
    } catch (error) {
      throw error;
    }
  }
}

export default DocumentService;
