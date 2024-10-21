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

  /**
   * Caches the downloaded PDF data by storing it with a unique document ID.
   * @param originalDocument - The original document object containing the document ID.
   * @param data - The array of strings representing the base64 encoded PDF pages.
   * @returns A promise that resolves when the data is successfully cached.
   */
  async cacheDownloadedData(
    originalDocument: IDocument,
    data: string[],
  ): Promise<void> {
    await CacheService.getInstance().storeValue(
      originalDocument.id as string,
      data,
    );
  }

  /**
   * Downloads a document by its ID using the provided token.
   * @param id - The ID of the document to download.
   * @param token - The authentication token (can be null).
   * @returns A promise that resolves to the downloaded document data as a string.
   * @throws Will throw an error if the download fails.
   */
  async downloadDocument(id: string, token: IToken | null): Promise<string> {
    try {
      const data = await DocumentServiceGet.download(id, token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Splits a PDF document into individual pages and returns each page as a base64 encoded string.
   * @param originalData - The base64 encoded string of the original PDF document.
   * @returns A promise that resolves to an array of base64 encoded strings, where each string represents a single page of the PDF.
   * @throws Will throw an error if splitting the PDF fails.
   */
  async splitPDF(originalData: string): Promise<string[]> {
    let data: string[] = [];
    try {
      const pdfDoc = await PDFDocument.load(originalData);
      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);

        // Serialize the new PDF to a base64 encoded string
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
