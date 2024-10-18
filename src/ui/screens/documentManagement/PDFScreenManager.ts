import IDocument from '../../../business-logic/model/IDocument';
import IToken from '../../../business-logic/model/IToken';

import CacheService from '../../../business-logic/services/CacheService';
import DocumentServiceGet from '../../../business-logic/services/DocumentService/DocumentService.get';

class PDFScreenManager {
  private static instance: PDFScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): PDFScreenManager {
    if (!PDFScreenManager.instance) {
      PDFScreenManager.instance = new PDFScreenManager();
    }
    return PDFScreenManager.instance;
  }

  async cacheDownloadedData(originalDocument: IDocument, data: string[]) {
    await CacheService.getInstance().storeValue(
      originalDocument.id as string,
      data,
    );
  }

  async downloadDocument(id: string, token: IToken | null): Promise<string> {
    try {
      const data = await DocumentServiceGet.download(id, token);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default PDFScreenManager;
