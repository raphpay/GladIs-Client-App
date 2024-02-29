import IDocumentActivityLog from '../model/IDocumentActivityLog';
import APIService from './APIService';

class DocumentActivityLogsService {
  private static instance: DocumentActivityLogsService | null = null;
  private baseRoute = 'documentActivityLogs';

  private constructor() {}

  static getInstance(): DocumentActivityLogsService {
    if (!DocumentActivityLogsService.instance) {
      DocumentActivityLogsService.instance = new DocumentActivityLogsService();
    }
    return DocumentActivityLogsService.instance;
  }

  // READ
  async getLogsForClient(clientID: string | undefined): Promise<IDocumentActivityLog[]> {
    try {
      const logs = await APIService.get<IDocumentActivityLog[]>(`${this.baseRoute}/${clientID}`);
      return logs;
    } catch (error) {
      console.error('Error getting logs for client:', clientID, error);
      throw error;
    }
  }
}

export default DocumentActivityLogsService;
