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
  async getDocumentsAtDirectory(path: string): Promise<IDocument[]> {
    try {
      const documents = await APIService.post<IDocument[]>(`${this.baseRoute}/directory`, { path })
      return documents;
    } catch (error) {
      console.error('Error getting documents at path:', path, error);
      throw error;
    }
  }
}

export default DocumentService;
