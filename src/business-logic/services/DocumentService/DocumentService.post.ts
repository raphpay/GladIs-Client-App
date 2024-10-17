import IDocument, { IDocumentPaginatedOutput } from "../../model/IDocument";
import IFile, { INewFile } from "../../model/IFile";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import DocumentService from "./DocumentService";

class DocumentServicePost extends DocumentService {
  static baseRoute = 'documents';

  /**
   * Retrieves the documents at the specified path.
   * @param path - The path to retrieve the documents from.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to an array of documents.
   * @throws If an error occurs while retrieving the documents.
   */
  static async getDocumentsAtPath(path: string, token: IToken | null): Promise<IDocument[]> {
    try {
      const url = `${this.baseRoute}/getDocumentsAtPath`;
      const documents = await APIService.post<IDocument[]>(url, { value: path }, token?.value as string);
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
  static async getPaginatedDocumentsAtPath(path: string, token: IToken | null, page: number, perPage: number): Promise<IDocumentPaginatedOutput> {
    try {
      const url = `${this.baseRoute}/paginated/path?page=${page}&perPage=${perPage}`;
      const output = await APIService.post<IDocumentPaginatedOutput>(url, { value: path }, token?.value as string);
      return output;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads a file as a document.
   * @param file - The file to upload.
   * @param name - The name of the document.
   * @param path - The path to upload the document to.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the uploaded document.
   * @throws If an error occurs while uploading the document.
   */
  static async upload(file: IFile, name: string, path: string, token: IToken | null): Promise<IDocument> {
    try {
      const params = { name, path, file };
      const response = await APIService.post<IDocument>(this.baseRoute, params, token?.value as string);
      return response as IDocument;
    } catch (error) {
      throw error;
    }
  }

  static async uploadNewFile(name: string, path: string, token: IToken | null): Promise<IDocument> {
    // // console.log("DocumentService uploadNewFile file", file);
    // try {
    //   // const formData = new FormData();
    //   // formData.append('file', file);
    //   console.log("DocumentService uploadNewFile formData", formData);
    //   const input = { formData, uri: path, name, path }
    //   // formData.append('uri', path);
    //   // formData.append('name', 'dummy.pdf');
    //   // formData.append('path', 'test/path/');

    //   console.log("DocumentService uploadNewFile input", input);
    //   const response = await APIService.postWithoutStringify<IDocument>(`${this.baseRoute}/filePart`, input, token?.value as string);
    //   console.log("DocumentService uploadNewFile response", response);
    //   return response as IDocument;
    // } catch (error) {
    //   throw error;
    // }

    const formData = new FormData();
    formData.append('file', {
      uri: path,
      type: 'application/octet-stream', // or adjust the MIME type based on your file type
      name,  // The file name
    });

    formData.append('uri', path);
    formData.append('name', 'dummy.pdf');
    formData.append('path', 'test/path/');

    const url = `${this.baseRoute}/filePart`;
    console.log('url', url);
    const response = await APIService.postWithoutStringify<IDocument>(url, formData, token?.value as string);
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