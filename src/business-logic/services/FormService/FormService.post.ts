import IForm, { IFormInput } from "../../model/IForm";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import FormService from "./FormService";

class FormServicePost extends FormService {
  static baseRoute = 'forms';

  /**
   * Creates a new form.
   * @param form The form to be created.
   * @param token The token to be used for authentication.
   * @returns The created form.
   * @throws An error if the operation fails.
   */
  static async create(form: IFormInput, token: IToken | null): Promise<IForm> {
    try {
      const createdForm = await APIService.post<IForm>(this.baseRoute, form, token?.value as string);
      return createdForm;
    } catch (error) {
      throw error
    }
  }

  // READ
  /**
   * Get all forms by client ID and path.
   * @param clientID The client ID.
   * @param token The token to be used for authentication.
   * @param token The token to be used for authentication.
   * @returns The forms.
   * @throws An error if the operation fails.
   */
  static async getAllByClientAtPath(clientID: string, path: string, token: IToken | null): Promise<IForm[]> {
    try {
      const route = `${this.baseRoute}/client/${clientID}/path`
      const forms = await APIService.post<IForm[]>(route, { value: path }, token?.value as string);
      return forms;
    } catch (error) {
      throw error
    }
  }
}

export default FormServicePost;