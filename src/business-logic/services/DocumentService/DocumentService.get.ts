import IDocument from '../../model/IDocument';
import IToken from '../../model/IToken';
import APIService from '../APIService';
import DocumentService from './DocumentService';

class DocumentServiceGet extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Downloads the document with the specified ID.
   * @param id - The ID of the document to download.
   * @param token - The authentication token.
   * @returns A promise that resolves to the downloaded document.
   * @throws If an error occurs while downloading the document.
   */
  static async download(id: string, token: IToken | null): Promise<any> {
    try {
      const url = `${this.baseRoute}/download/${id}`;
      const data = await APIService.download(url, token?.value as string);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all documents
   * @param token - The authentication token.
   * @returns A promise that resolves to the documents.
   * @throws If an error occurs while getting the documents.
   */
  static async getAll(token: IToken | null): Promise<IDocument[]> {
    try {
      const docs = await APIService.get<IDocument[]>(
        this.baseRoute,
        token?.value as string,
      );
      return docs;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Remove from API
  // static async getDocumentPagesByNameAndPath(
  //   name: string,
  //   apiPath: string,
  //   token: IToken | null,
  // ): Promise<IDocument[]> {
  //   try {
  //     const input = { name: Utils.removePdfExtension(name), path: apiPath };
  //     const url = `${this.baseRoute}/pages/byName/andPath`;
  //     const documents = await APIService.post<IDocument[]>(
  //       url,
  //       input,
  //       token?.value as string,
  //     );
  //     return documents;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default DocumentServiceGet;
