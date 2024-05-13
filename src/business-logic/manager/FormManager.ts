import Clipboard from "@react-native-clipboard/clipboard";
// Token
import IToken from "../model/IToken";
// Form
import IForm from "../model/IForm";
import FormService from "../services/FormService";
// User
import UserType from "../model/enums/UserType";
// Event
import { IEventInput } from "../model/IEvent";
import EventService from "../services/EventService";

export interface IResult {
  success: boolean;
  message: string;
}

/**
 * A class to handle form management logic
 */
class FormManager {
  private static instance: FormManager;

  private constructor() {}

  // Singleton
  static getInstance(): FormManager {
    if (!FormManager.instance) {
      FormManager.instance = new FormManager();
    }
    return FormManager.instance;
  }

  // Sync Methods
  /**
   * Export form to CSV
   * @param form The form to export
   * @returns void
   */
  exportToCSV(form: IForm) {
    const value = form.value;
    Clipboard.setString(value);
  }

  // Async Methods
  /**
   * Load forms
   * @param clientID The client ID
   * @param atPath The path
   * @param token The token
   * @returns A promise of an array of forms
   */
  async loadForms(clientID: string, atPath: string, token: IToken | null): Promise<IForm[]> {
    try {
      const forms = await FormService.getInstance().getAllByClientAtPath(clientID, atPath, token);
      return forms;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Integrate diagram logic
  /** 
   * Approve form by client
   * @param form The form to approve
   * @param token The token
   * @returns A promise of a result
  */
  async clientApprove(form: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    const formID = form.id as string;

    try {
      const updatedForm = await FormService.getInstance().approve(formID, UserType.Client, token);
      if (updatedForm.approvedByClient && !updatedForm.approvedByAdmin) {
        // Send reminder to Admin
        this.createFormApprovalEvent(updatedForm, token);
      }
      result.success = true;
      result.message = 'forms.toast.success.approve';
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }

  async clientDeapprove(form: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    const formID = form.id as string;

    try {
      await FormService.getInstance().deapprove(formID, UserType.Client, token);
      result.success = true;
      result.message = 'forms.toast.success.deapprove';
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }
  
  /** 
   * Approve form by admin
   * @param form The form to approve
   * @param token The token
   * @returns A promise of a result
  */
  async adminApprove(form: IForm, token: IToken | null) : Promise<IResult> {
    const result: IResult = {
      success: false,
      message: "",
    };
    
    const formID = form.id as string;

    try {
      await FormService.getInstance().approve(formID, UserType.Admin, token);
      result.success = true;
      result.message = 'forms.toast.success.approve';
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }

  async adminDeapprove(form: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    const formID = form.id as string;

    try {
      await FormService.getInstance().deapprove(formID, UserType.Admin, token);
      result.success = true;
      result.message = 'forms.toast.success.deapprove';
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }

  /**
   * Delete form
   * @param selectedForm The selected form
   * @param token The token
   * @returns A promise of a result
   */
  async deleteForm(selectedForm: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    try {
      await FormService.getInstance().delete(selectedForm.id as string, token);
      result.success = true;
      result.message = 'forms.actions.remove.success';
    } catch (error) {
      result.message = (error as Error).message;;
      result.success = false;
    }

    return result;
  }

  // Private methods
  /** 
   * Create form approval event
   * @param form The form
   * @param token The token
   * @returns void
  */
  private async createFormApprovalEvent(form: IForm, token: IToken | null) {
    const eventInput: IEventInput = {
      name: `Formulaire \"${form.title}\" à approuver. Dossier: ${form.path}`,
      date: Date.now(),
      clientID: form.clientID,
    };
    try {
      await EventService.getInstance().create(eventInput, token);
    } catch (error) {
      throw error;
    }
  }
}

export default FormManager;
