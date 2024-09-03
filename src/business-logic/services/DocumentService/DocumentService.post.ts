import IDocument from "../../model/IDocument";
import IFile from "../../model/IFile";
import APIService from "../APIService";
import DocumentService from "../DocumentService";

class DocumentServicePost extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Uploads a logo file.
   * @param file - The logo file to upload.
   * @param name - The name of the logo.
   * @param path - The path to upload the logo to.
   * @returns A promise that resolves to the uploaded logo document.
   * @throws If an error occurs while uploading the logo.
   */
  static async uploadLogo(file: IFile, name: string, path: string): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(`${this.baseRoute}/logo`, params);
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }
}

export default DocumentServicePost;