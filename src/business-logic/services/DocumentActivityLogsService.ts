import IDocumentActivityLog, { IDocumentActivityLogInput } from '../model/IDocumentActivityLog';
import IToken from '../model/IToken';
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

  // CREATE
  async recordLog(logInput: IDocumentActivityLogInput, token: IToken | null) {
    try {
      await APIService.post<IDocumentActivityLog>(this.baseRoute, logInput, token?.value);
    } catch (error) {
      console.error('Error posting log for client:', logInput.clientID, 'for doc:', logInput.documentID, error);
      throw error;
    }
  }

  // READ
  async getLogsForClient(clientID: string | undefined, token: IToken | null): Promise<IDocumentActivityLog[]> {
    try {
      const logs = await APIService.get<IDocumentActivityLog[]>(`${this.baseRoute}/${clientID}`, token?.value);
      return logs;
    } catch (error) {
      console.error('Error getting logs for client:', clientID, error);
      throw error;
    }
  }
}

export default DocumentActivityLogsService;
