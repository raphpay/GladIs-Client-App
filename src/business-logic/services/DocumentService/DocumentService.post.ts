// Models
import MimeType from '../../model/enums/MimeType';
import IDocument, { IDocumentPaginatedOutput } from '../../model/IDocument';
import IFile from '../../model/IFile';
import IToken from '../../model/IToken';
// Services
import APIService from '../APIService';
import DocumentService from './DocumentService';

class DocumentServicePost extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Retrieves the documents at the specified path.
   * @param path - The path to retrieve the documents from.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to an array of documents.
   * @throws If an error occurs while retrieving the documents.
   */
  static async getDocumentsAtPath(
    path: string,
    token: IToken | null,
  ): Promise<IDocument[]> {
    try {
      const url = `${this.baseRoute}/getDocumentsAtPath`;
      const documents = await APIService.post<IDocument[]>(
        url,
        { value: path },
        token?.value as string,
      );
      return documents;
    } catch (error) {
      console.log('Error getting documents at path:', path, error);
      throw error;
    }
  }

  /**
   * Retrieves the paginated documents at the specified path.
   * @param path - The path to retrieve the documents from.
   * @param token - The authentication token (optional).
   * @param page - The page number.
   * @returns A promise that resolves to the paginated documents.
   * @throws If an error occurs while retrieving the documents.
   */
  static async getPaginatedDocumentsAtPath(
    path: string,
    token: IToken | null,
    page: number,
    perPage: number,
  ): Promise<IDocumentPaginatedOutput> {
    try {
      const url = `${this.baseRoute}/paginated/path?page=${page}&perPage=${perPage}`;
      const output = await APIService.post<IDocumentPaginatedOutput>(
        url,
        { value: path },
        token?.value as string,
      );
      return output;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a file as a document.
   * @param name - The file name to upload.
   * @param originPath - The origin path ( in the computer ) of the document.
   * @param destinationPath - The path to upload the document to ( in the database ).
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the uploaded document.
   * @throws If an error occurs while uploading the document.
   */
  static async upload(
    name: string,
    originPath: string,
    destinationPath: string,
    token: IToken | null,
  ): Promise<IDocument> {
    const formData = this.createFormData(originPath, name, destinationPath);

    const response = await APIService.postWithoutStringify<IDocument>(
      this.baseRoute,
      formData,
      token?.value as string,
    );
    return response as IDocument;
  }

  /**
   * Uploads a logo file.
   * @param file - The logo file to upload.
   * @param name - The name of the logo.
   * @param path - The path to upload the logo to.
   * @returns A promise that resolves to the uploaded logo document.
   * @throws If an error occurs while uploading the logo.
   */
  static async uploadLogo(
    file: IFile,
    name: string,
    path: string,
  ): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(
        `${this.baseRoute}/logo`,
        params,
      );
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  static async uploadLogoFormData(
    name: string,
    originPath: string,
    destinationPath: string,
    type: MimeType,
  ): Promise<IDocument> {
    try {
      const formData = this.createFormData(
        originPath,
        name,
        destinationPath,
        type,
      );
      const url = `${this.baseRoute}/image`;
      const doc = await APIService.postWithoutStringify<IDocument>(
        url,
        formData,
      );
      return doc;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a file as a document via base 64 data ( for Windows ).
   * @param file - The file to upload.
   * @param name - The name of the document.
   * @param path - The path to upload the document to.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the uploaded document.
   * @throws If an error occurs while uploading the document.
   */
  static async uploadViaBase64Data(
    file: IFile,
    name: string,
    path: string,
    token: IToken | null,
  ): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(
        `${this.baseRoute}/data`,
        params,
        token?.value as string,
      );
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads an image to a specified path using base64-encoded data.
   * @param file - An `IFile` object containing base64 image data and the filename.
   * @param name - The name of the image to be saved.
   * @param path - The destination path where the image should be uploaded.
   * @returns A promise that resolves to an `IDocument` object representing the uploaded document.
   * @throws If an error occurs during the upload process.
   */
  static async uploadImageViaBase64Data(
    file: IFile,
    name: string,
    path: string,
  ): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(
        `${this.baseRoute}/image/data`,
        params,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a `FormData` object containing image information for uploading as a file.
   * @param originPath - The file's original URI or path.
   * @param name - The name to assign to the file during upload.
   * @param destinationPath - The path where the file should be uploaded.
   * @param type - Optional MIME type for the file, defaults to `application/octet-stream`.
   * @returns A `FormData` object ready for uploading.
   */
  private static createFormData(
    originPath: string,
    name: string,
    destinationPath: string,
    type?: MimeType | null,
  ): FormData {
    const formData = new FormData();
    formData.append('file', {
      uri: originPath,
      type: type || 'application/octet-stream',
      name,
    });

    formData.append('uri', originPath);
    formData.append('name', name);
    formData.append('path', destinationPath);

    return formData;
  }
}

export default DocumentServicePost;
