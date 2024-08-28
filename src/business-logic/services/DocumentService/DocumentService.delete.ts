import IToken from "../../model/IToken";
import APIService from "../APIService";
import DocumentService from "../DocumentService";

class DocumentServiceDelete extends DocumentService {
  static baseRoute = 'documents';

  static async delete(documentID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/${documentID}`;
      await APIService.delete(url, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default DocumentServiceDelete;