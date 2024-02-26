import { IDocument } from '../model/IModule';
import APIService from './APIService';

class DocumentService {
  private static instance: DocumentService | null = null;
  private baseRoute = 'documents';

  private constructor() {}

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  // READ
  async getDocumentsAtPath(path: string): Promise<IDocument[]> {
    try {
      const url = `${this.baseRoute}/getDocumentsAtPath`;
      const documents = await APIService.post<IDocument[]>(url, { value: path })
      return documents;
    } catch (error) {
      console.error('Error getting documents at path:', path, error);
      throw error;
    }
  }

  async download(id: string): Promise<any> {
    try {
      const url = `${this.baseRoute}/download/${id}`;
      return await APIService.download(url);
    } catch (error) {
      console.error('Error downloading documents at id:', id, error);
      throw error;
    }
  }

  async upload(data: string, name: string, path: string): Promise<IDocument> {
    const params = { name, path, data };
    const response = await APIService.post<IDocument>('documents', params);
    return response as IDocument;
  }
}

export default DocumentService;
