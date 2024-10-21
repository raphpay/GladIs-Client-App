import { PDFDocument } from 'pdf-lib';
// Models
import IDocument from '../../model/IDocument';
import IToken from '../../model/IToken';
// Services
import CacheService from '../../services/CacheService';
import DocumentServiceGet from '../../services/DocumentService/DocumentService.get';

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

  async splitPDF(originalData: string): Promise<string[]> {
    let data: string[] = [];
    try {
      const pdfDoc = await PDFDocument.load(originalData);
      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);
        // Serialize the new PDF to bytes
        const newPdfBytes = await newPdfDoc.saveAsBase64();
        data.push(newPdfBytes);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default PDFScreenManager;
