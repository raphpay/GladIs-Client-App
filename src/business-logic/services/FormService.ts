import IForm, { IFormInput, IFormUpdateInput } from '../model/IForm';
import IToken from '../model/IToken';
import UserType from '../model/enums/UserType';

import APIService from './APIService';

/**
 * Represents a service for managing user-related operations.
 */
class FormService {
  private static instance: FormService | null = null;
  private baseRoute = 'forms';

  private constructor() {}

  /**
   * Returns the singleton instance of the FormService class.
   * @returns The singleton instance of the FormService class.
   */
  static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  // CREATE
  /**
   * Creates a new form.
   * @param form The form to be created.
   * @param token The token to be used for authentication.
   * @returns The created form.
   * @throws An error if the operation fails.
   */
  async create(form: IFormInput, token: IToken | null): Promise<IForm> {
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
  async getAllByClientAtPath(clientID: string, path: string, token: IToken | null): Promise<IForm[]> {
    try {
      const route = `${this.baseRoute}/client/${clientID}/path`
      const forms = await APIService.post<IForm[]>(route, { value: path }, token?.value as string);
      return forms;
    } catch (error) {
      throw error
    }
  }

  // UPDATE
  /**
   * Update a form.
   * @param formID The form ID.
   * @param newForm The new form data.
   * @param token The token to be used for authentication.
   * @throws An error if the operation fails. 
   */
  async update(formID: string, newForm: IFormUpdateInput, token: IToken | null): Promise<void> {
    try {
      const route = `${this.baseRoute}/${formID}`;
      await APIService.put(route, newForm, token?.value as string);
    } catch (error) {
      throw error
    }
  }

  /**
   * Toggle the form approval status.
   * @param formID The form ID.
   * @param userType The user type.
   * @param token The token to be used for authentication.
   * @returns The updated form.
   * @throws An error if the operation fails.
   */
  async approve(formID: string, userType: UserType, token: IToken | null): Promise<IForm> {
    try {
      let userRoute = '';
      if (userType === UserType.Client) {
        userRoute = 'client';
      } else if (userType === UserType.Admin) {
        userRoute = 'admin';
      }
      const route = `${this.baseRoute}/${userRoute}/${formID}/approval`;
      const form = await APIService.put(route, null, token?.value as string);
      return form;
    } catch (error) {
      throw error
    }
  }

  // DELETE
  /**
   * Deletes a form.
   * @param formID The form ID.
   * @param token The token to be used for authentication.
   * @throws An error if the operation fails.
   */
  async delete(formID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${formID}`, token?.value as string);
    } catch (error) {
      throw error
    }
  }
}

export default FormService;
