// import { DownloadDirectoryPath, writeFile } from '@dr.pogodin/react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';
// Token
import IToken from '../model/IToken';
// Form
import IForm from '../model/IForm';
import FormServiceDelete from '../services/FormService/FormService.delete';
import FormServicePost from '../services/FormService/FormService.post';
import FormServicePut from '../services/FormService/FormService.put';
// User
import UserType from '../model/enums/UserType';
// Event
import { IEventInput } from '../model/IEvent';
import EventServicePost from '../services/EventService/EventService.post';
// Logs
import { IDocumentActivityLogInput } from '../model/IDocumentActivityLog';
import DocumentLogAction from '../model/enums/DocumentLogAction';
import DocumentActivityLogsService from '../services/DocumentActivityLogsService';

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
  async exportToCSV(form: IForm) {
    // const value = form.value;
    // try {
    //   const destinationPath = DownloadDirectoryPath + `/${form.title}.csv`;
    //   await writeFile(destinationPath, value);
    // } catch (error) {
    //   throw error;
    // }
    this.copyCSV(form);
  }

  copyCSV(form: IForm) {
    Clipboard.setString(form.value);
  }

  // Async Methods
  /**
   * Load forms
   * @param clientID The client ID
   * @param atPath The path
   * @param token The token
   * @returns A promise of an array of forms
   */
  async loadForms(
    clientID: string,
    atPath: string,
    token: IToken | null,
  ): Promise<IForm[]> {
    try {
      const forms = await FormServicePost.getAllByClientAtPath(
        clientID,
        atPath,
        token,
      );
      return forms;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve form by client
   * @param form The form to approve
   * @param token The token
   * @returns A promise of a result
   */
  async clientApprove(form: IForm, token: IToken | null): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: '',
    };
    const formID = form.id as string;

    try {
      const updatedForm = await FormServicePut.approve(
        formID,
        UserType.Client,
        token,
      );
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
      message: '',
    };
    const formID = form.id as string;

    try {
      await FormServicePut.deapprove(formID, UserType.Client, token);
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
  async adminApprove(form: IForm, token: IToken | null): Promise<IResult> {
    const result: IResult = {
      success: false,
      message: '',
    };

    const formID = form.id as string;

    try {
      await FormServicePut.approve(formID, UserType.Admin, token);
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
      message: '',
    };
    const formID = form.id as string;

    try {
      await FormServicePut.deapprove(formID, UserType.Admin, token);
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
  async deleteForm(
    selectedForm: IForm,
    token: IToken | null,
  ): Promise<IResult> {
    let result: IResult = {
      success: false,
      message: '',
    };
    try {
      await FormServiceDelete.delete(selectedForm.id as string, token);
      result.success = true;
      result.message = 'forms.actions.remove.success';
    } catch (error) {
      result.message = (error as Error).message;
      result.success = false;
    }

    return result;
  }

  /**
   * Record a log
   * @param action The action
   * @param userType The user type
   * @param currentUserID The current user ID
   * @param currentClientID The current client ID
   * @param form The form
   * @param token The token
   * @returns void
   * @throws Error if there is an error recording the log
   */
  async recordLog(
    action: DocumentLogAction,
    userType: UserType,
    currentUserID: string,
    currentClientID: string,
    form: IForm,
    token: IToken | null,
  ) {
    const logInput: IDocumentActivityLogInput = {
      action,
      actorIsAdmin: userType == UserType.Admin,
      actorID: currentUserID as string,
      clientID: currentClientID as string,
      formID: form.id,
    };
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
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
      await EventServicePost.create(eventInput, token);
    } catch (error) {
      throw error;
    }
  }
}

export default FormManager;
