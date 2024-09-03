import IToken from "../../model/IToken";
import APIService from "../APIService";
import FormService from "./FormService";

class FormServiceDelete extends FormService {
  static baseRoute = 'forms';

  /**
   * Deletes a form.
   * @param formID The form ID.
   * @param token The token to be used for authentication.
   * @throws An error if the operation fails.
   */
  static async delete(formID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${formID}`, token?.value as string);
    } catch (error) {
      throw error
    }
  }
}

export default FormServiceDelete;