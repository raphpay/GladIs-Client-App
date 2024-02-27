import IDocument from '../model/IDocument';
import IFile from '../model/IFile';
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

  async upload(file: IFile, name: string, path: string): Promise<IDocument> {
    const params = { name, path, file };
    const response = await APIService.post<IDocument>('documents', params);
    return response as IDocument;
  }
}

export default DocumentService;