import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing documents.
 */
class DocumentService {
  private static instance: DocumentService | null = null;
  private baseRoute = 'documents';

  constructor() {}

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
}

export default DocumentService;
