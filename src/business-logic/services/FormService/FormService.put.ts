import UserType from "../../model/enums/UserType";
import IForm, { IFormUpdateInput } from "../../model/IForm";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import FormService from "./FormService";

class FormServicePut extends FormService {
  static baseRoute = 'forms';

  /**
   * Update a form.
   * @param formID The form ID.
   * @param newForm The new form data.
   * @param token The token to be used for authentication.
   * @throws An error if the operation fails. 
   */
  static async update(formID: string, newForm: IFormUpdateInput, token: IToken | null): Promise<void> {
    try {
      const route = `${this.baseRoute}/${formID}`;
      await APIService.put(route, newForm, token?.value as string);
    } catch (error) {
      throw error
    }
  }

  /**
   * Approve a form.
   * @param formID The form ID.
   * @param userType The user type.
   * @param token The token to be used for authentication.
   * @returns The updated form.
   * @throws An error if the operation fails.
   */
  static async approve(formID: string, userType: UserType, token: IToken | null): Promise<IForm> {
    try {
      let userRoute = '';
      if (userType === UserType.Client) {
        userRoute = 'client';
      } else if (userType === UserType.Admin) {
        userRoute = 'admin';
      }
      const route = `${this.baseRoute}/${userRoute}/${formID}/approve`;
      const form = await APIService.put(route, null, token?.value as string);
      return form;
    } catch (error) {
      throw error
    }
  }

  /**
   * Deapprove a form.
   * @param formID The form ID.
   * @param userType The user type.
   * @param token The token to be used for authentication.
   * @returns The updated form.
   * @throws An error if the operation fails.
   */
  static async deapprove(formID: string, userType: UserType, token: IToken | null): Promise<IForm> {
    try {
      let userRoute = '';
      if (userType === UserType.Client) {
        userRoute = 'client';
      } else if (userType === UserType.Admin) {
        userRoute = 'admin';
      }
      const route = `${this.baseRoute}/${userRoute}/${formID}/deapprove`;
      const form = await APIService.put(route, null, token?.value as string);
      return form;
    } catch (error) {
      throw error
    }
  }

  /**
   * Unapprove a form for both client and admin.
   * @param formID The form ID.
   * @param token The token to be used for authentication.
   * @throws An error if the operation fails.
  */
  static async unapprove(formID: string, token: IToken | null): Promise<void> {
    try {
      await this.deapprove(formID, UserType.Client, token);
      await this.deapprove(formID, UserType.Admin, token);
    } catch (error) {
      throw error
    }
  }
}

export default FormServicePut;