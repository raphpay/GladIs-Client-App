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

// TODO: Add documentation
class FormManager {
  private static instance: FormManager;
  private forms: IForm[] = [];

  private constructor() {}

  // Singleton
  static getInstance(): FormManager {
    if (!FormManager.instance) {
      FormManager.instance = new FormManager();
    }
    return FormManager.instance;
  }

  // Setters
  setForms(forms: IForm[]) {
    this.forms = forms;
  }

  // Getters
  getForms(): IForm[] {
    return this.forms;
  }

  // Sync Methods
  exportToCSV(form: IForm) {
    const value = form.value;
    Clipboard.setString(value);
  }

  // Async Methods
  async loadForms(clientID: string, atPath: string, token: IToken | null): Promise<IForm[]> {
    try {
      const forms = await FormService.getInstance().getAllByClientAtPath(clientID, atPath, token);
      this.setForms(forms);
      return forms;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Integrate diagram logic
  async approve(form: IForm, userType: UserType, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    switch (userType) {
      case UserType.Client:
        result = await this.clientApprove(form, token);
        break;
      case UserType.Admin:
        result = await this.adminApprove(form, token);
        break;
      default:
        break;
    }

    return result;
  }

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
  private async clientApprove(form: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: "",
    };
    const formID = form.id as string;

    try {
      const updatedForm = await FormService.getInstance().approve(formID, UserType.Client, token);
      // Send reminder to Admin
      this.createFormApprovalEvent(updatedForm, token);
      result.success = true;
      const message = updatedForm.approvedByClient ? 'forms.toast.success.approve' : 'forms.toast.success.deapprove';
      result.message = message;
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }
  
  private async adminApprove(form: IForm, token: IToken | null) : Promise<IResult> {
    const result: IResult = {
      success: false,
      message: "",
    };
    
    const formID = form.id as string;

    try {
      const updatedForm = await FormService.getInstance().approve(formID, UserType.Admin, token);
      result.success = true;
      const message = updatedForm.approvedByAdmin ? 'forms.toast.success.approve' : 'forms.toast.success.deapprove';
      result.message = message;
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }

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
