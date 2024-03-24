import IDocumentActivityLog, { IDocumentActivityLogInput } from '../model/IDocumentActivityLog';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Service class for managing document activity logs.
 */
class DocumentActivityLogsService {
  private static instance: DocumentActivityLogsService | null = null;
  private baseRoute = 'documentActivityLogs';

  private constructor() {}

  /**
   * Returns the singleton instance of DocumentActivityLogsService.
   * @returns The singleton instance of DocumentActivityLogsService.
   */
  static getInstance(): DocumentActivityLogsService {
    if (!DocumentActivityLogsService.instance) {
      DocumentActivityLogsService.instance = new DocumentActivityLogsService();
    }
    return DocumentActivityLogsService.instance;
  }

  /**
   * Records a document activity log.
   * @param logInput - The input data for the log.
   * @param token - The authentication token.
   */
  async recordLog(logInput: IDocumentActivityLogInput, token: IToken | null) {
    try {
      await APIService.post<IDocumentActivityLog>(this.baseRoute, logInput, token?.value);
    } catch (error) {
      console.log('Error posting log for client:', logInput.clientID, 'for doc:', logInput.documentID, error);
      throw error;
    }
  }

  /**
   * Retrieves the document activity logs for a client.
   * @param clientID - The ID of the client.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of document activity logs.
   */
  async getLogsForClient(clientID: string | undefined, token: IToken | null): Promise<IDocumentActivityLog[]> {
    try {
      const logs = await APIService.get<IDocumentActivityLog[]>(`${this.baseRoute}/${clientID}`, token?.value);
      return logs;
    } catch (error) {
      console.log('Error getting logs for client:', clientID, error);
      throw error;
    }
  }

  /**
   * Retrieves the document activity logs for a client, paginated.
   * @param clientID - The ID of the client.
   * @param token - The authentication token.
   * @param page - The page number.
   * @returns A promise that resolves to an array of document activity logs.
   * @throws An error if the logs cannot be retrieved.
   */
  async getPaginatedLogsForClient(clientID: string | undefined, token: IToken | null, page: number): Promise<IDocumentActivityLog[]> {
    try {
      const logs = await APIService.get<IDocumentActivityLog[]>(`${this.baseRoute}/paginate/${clientID}?page=${page}&perPage=5`, token?.value);
      return logs;
    } catch (error) {
      console.log('Error getting logs for client:', clientID, error);
      throw error;
    }
  }
}

export default DocumentActivityLogsService;
