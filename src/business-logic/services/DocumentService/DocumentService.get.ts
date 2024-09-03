import IToken from "../../model/IToken";
import APIService from "../APIService";
import DocumentService from "./DocumentService";

class DocumentServiceGet extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Downloads the document with the specified ID.
   * @param id - The ID of the document to download.
   * @param token - The authentication token (optional).
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
}

export default DocumentServiceGet;