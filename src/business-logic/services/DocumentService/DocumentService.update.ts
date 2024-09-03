import IDocument from "../../model/IDocument";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import DocumentService from "../DocumentService";

class DocumentServiceUpdate extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Updates the status of the document with the specified ID.
   * @param id - The ID of the document to update.
   * @param status - The new status of the document.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the updated document.
   * @throws If an error occurs while updating the status of the document.
   */
  static async updateStatus(id: string, status: string, token: IToken | null): Promise<IDocument> {
  try {
    const response = await APIService.put(`${this.baseRoute}/${id}`, { status }, token?.value as string);
    return response as IDocument;
  } catch (error) {
    throw error;
  }
}
}

export default DocumentServiceUpdate;