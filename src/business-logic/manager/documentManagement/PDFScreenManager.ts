import { PDFDocument } from 'pdf-lib';
// Models
import IDocument from '../../model/IDocument';
import IToken from '../../model/IToken';
// Services
import CacheService from '../../services/CacheService';
import DocumentServiceGet from '../../services/DocumentService/DocumentService.get';
// Utils
import Utils from '../../utils/Utils';

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

  // Public
  /**
   * Loads the document data either from the cache or from the API if not available in the cache.
   * @param documentInput - The document input for which data is to be loaded.
   * @param token - The authentication token (optional) to be used for API requests if needed.
   * @returns A promise that resolves to an array of strings (the document data) or null if no data is found.
   * @throws If an error occurs during loading from the cache or the API.
   */
  async loadData(
    documentInput: IDocument,
    token: IToken | null,
  ): Promise<string[] | null> {
    let cachedData: string[] | null;
    cachedData = await this.loadFromCache(documentInput);
    if (cachedData === null || cachedData === undefined) {
      cachedData = await this.loadFromAPI(documentInput, token);
    }
    return cachedData;
  }

  // Private
  /**
   * Splits a PDF document into individual pages and returns each page as a base64 encoded string.
   * @param originalData - The base64 encoded string of the original PDF document.
   * @returns A promise that resolves to an array of base64 encoded strings, where each string represents a single page of the PDF.
   * @throws Will throw an error if splitting the PDF fails.
   */
  private async splitPDF(originalData: string): Promise<string[]> {
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

  /**
   * Downloads a document by its ID using the provided token.
   * @param id - The ID of the document to download.
   * @param token - The authentication token (can be null).
   * @returns A promise that resolves to the downloaded document data as a string.
   * @throws Will throw an error if the download fails.
   */
  private async downloadDocument(
    id: string,
    token: IToken | null,
  ): Promise<string> {
    try {
      const data = await DocumentServiceGet.download(id, token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Caches the downloaded PDF data by storing it with a unique document ID.
   * @param originalDocument - The original document object containing the document ID.
   * @param data - The array of strings representing the base64 encoded PDF pages.
   * @returns A promise that resolves when the data is successfully cached.
   */
  private async cacheDownloadedData(
    originalDocument: IDocument,
    data: string[],
  ): Promise<void> {
    await CacheService.getInstance().storeValue(
      originalDocument.id as string,
      data,
    );
  }

  /**
   * Attempts to load the document data from the cache.
   * @param documentInput - The document input for which data is to be loaded from the cache.
   * @returns A promise that resolves to an array of strings (cached data) or null if no cached data is found.
   * @throws If an error occurs while retrieving the data from the cache.
   */
  private async loadFromCache(
    documentInput: IDocument,
  ): Promise<string[] | null> {
    try {
      const cachedData = await CacheService.getInstance().retrieveValue(
        documentInput.id as string,
      );
      return (cachedData as string[]) || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Loads the document data from the API, processes it, and caches the result.
   * @param documentInput - The document input for which data is to be fetched from the API.
   * @param token - The authentication token (optional) to be used for the API request.
   * @returns A promise that resolves to an array of strings (the document data).
   * @throws If an error occurs during the API request or data processing.
   */
  private async loadFromAPI(
    documentInput: IDocument,
    token: IToken | null,
  ): Promise<string[]> {
    let data: string[] = [];
    try {
      const docData = await this.downloadDocument(documentInput.id, token);
      const sanitizedData = Utils.removeBase64Prefix(docData);
      data = await this.splitPDF(sanitizedData);
    } catch (error) {
      throw error;
    }
    await this.cacheDownloadedData(documentInput, data);
    return data;
  }
}

export default PDFScreenManager;
