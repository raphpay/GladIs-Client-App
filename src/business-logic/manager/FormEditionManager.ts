// Form
import IForm, { IFormCell, IFormInput, IFormUpdateInput } from "../model/IForm";
// Token
import IToken from "../model/IToken";
// User
import IUser from "../model/IUser";
import UserType from "../model/enums/UserType";
// Services
import FormServicePost from "../services/FormService/FormService.post";
import FormServicePut from "../services/FormService/FormService.put";
import UserServiceGet from "../services/UserService/UserService.get";
import Utils from "../utils/Utils";
// Logs
import { IDocumentActivityLogInput } from "../model/IDocumentActivityLog";
import DocumentLogAction from "../model/enums/DocumentLogAction";
import DocumentActivityLogsService from "../services/DocumentActivityLogsService";

/**
 * A class to handle form edition logic
 */
class FormEditionManager {
  private static instance: FormEditionManager;
  private grid: IFormCell[][] = [[]];
  private formTitle: string = '';
  private formCreation: string = '';
  private formCreationActor: string = '';
  private formUpdate: string = '';
  private formUpdateActor: string = '';

  private constructor() {}

  // Singleton
  static getInstance(): FormEditionManager {
    if (!FormEditionManager.instance) {
      FormEditionManager.instance = new FormEditionManager();
    }
    return FormEditionManager.instance;
  }

  //  Setters
  setGrid(grid: IFormCell[][]) {
    this.grid = grid;
  }

  setFormTitle(title: string) {
    this.formTitle = title;
  }

  setFormCreation(creation: string) {
    this.formCreation = creation;
  }

  setFormCreationActor(actor: string) {
    this.formCreationActor = actor;
  }

  setFormUpdate(update: string) {
    this.formUpdate = update;
  }

  setFormUpdateActor(actor: string) {
    this.formUpdateActor = actor;
  }

  // Getters
  getGrid(): IFormCell[][] {
    return this.grid;
  }

  getFormTitle(): string {
    return this.formTitle;
  }

  getFormCreation(): string {
    return this.formCreation;
  }

  getFormCreationActor(): string {
    return this.formCreationActor;
  }

  getFormUpdate(): string {
    return this.formUpdate;
  }

  getFormUpdateActor(): string {
    return this.formUpdateActor;
  }

  // Sync Methods
  /**
   * Converts the grid to a CSV string
   * @returns The CSV string
   */
  arrayToCsv() {
    const csv = this.grid.map(row => row.map(cell => cell.value).join(',')).join('\n');
    return csv;
  }

  // Async Methods
  /**
   * Loads and sets the grid from a form
   * @param form The form to load the grid from
  */
  async loadGrid(form: IForm | undefined) {
    if (form) {
      const gridFromCSV = Utils.csvToGrid(form.value);
      this.setGrid(gridFromCSV);
    }
  }

  /**
   * Loads and sets the form info
   * @param form The form to load the info from
   * @param currentUser The current user
   * @param token The token
   */
  async loadFormInfo(form: IForm | undefined, currentUser: IUser | undefined, token: IToken | null) {
    if (form) {
      this.setFormTitle(form.title);
      if (form.createdAt && form.createdBy) {
        const creationDate = Utils.formatStringDate(new Date(form.createdAt), 'numeric');
        this.setFormCreation(creationDate);
        const createdByUser = await this.loadUser(form.createdBy, token);
        if (createdByUser) {
          this.setFormCreationActor(createdByUser.firstName + ' ' + createdByUser.lastName);
        }
      } else {
        const creationDate = Utils.formatStringDate(new Date(), 'numeric');
        this.setFormCreation(creationDate);
        const createdByUser = await this.loadUser(currentUser?.id as string, token);
        if (createdByUser) {
          this.setFormCreationActor(createdByUser.firstName + ' ' + createdByUser.lastName);
        }
      }
      
      if (form.updatedAt && form.updatedBy) {
        const updateDate = form.updatedAt && Utils.formatStringDate(new Date(form.updatedAt), 'numeric');
        this.setFormUpdate(updateDate);
        const updatedByUser = await this.loadUser(form.updatedBy, token);
        if (updatedByUser) {
          this.setFormUpdateActor(updatedByUser.firstName + ' ' + updatedByUser.lastName);
        }
      }
      const gridFromCSV = Utils.csvToGrid(form.value);
      this.setGrid(gridFromCSV);
    } else {
      this.setFormCreation(Utils.formatStringDate(new Date(), 'numeric'));
      this.setFormCreationActor(currentUser?.firstName + ' ' + currentUser?.lastName);
    }
  }

  /**
   * Creates a form
   * @param title The form title
   * @param currentUserID The current user ID
   * @param path The form path
   * @param clientID The client ID
   * @param token The token
   * @throws Error if there is an error creating the form
   */
  async createForm(title: string, currentUserID: string, path: string, clientID: string, token: IToken | null): Promise<IForm> {
    try {
      const newForm: IFormInput = {
        title,
        createdBy: currentUserID,
        value: this.arrayToCsv(),
        path,
        clientID,
      }
      const createdForm = await FormServicePost.create(newForm, token);
      return createdForm;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a form
   * @param form The form to update
   * @param currentUser The current user
   * @param token The token
   * @throws Error if there is an error updating the form 
   */
  async updateForm(form: IForm, currentUser: IUser | undefined, token: IToken | null) {
    try {
      const updateUserID = currentUser?.id as string;
      const newForm: IFormUpdateInput = {
        updatedBy: updateUserID,
        value: this.arrayToCsv(),
      };
      await FormServicePut.update(form.id as string, newForm, token);
      if (form.approvedByAdmin || form.approvedByClient) {
        await FormServicePut.unapprove(form.id as string, token);
      }
    } catch (error) {
      throw error;
    }
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
    currentUserID: string, currentClientID: string,
    form: IForm, token: IToken | null
  ) {
    const logInput: IDocumentActivityLogInput = {
      action,
      actorIsAdmin: userType == UserType.Admin,
      actorID: currentUserID as string,
      clientID: currentClientID as string,
      formID: form.id,
    }
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
  }

  // Private Methods
  /**
   * Loads a user by ID
   * @param id The user ID
   * @param token The token
   */
  private async loadUser(id: string, token: IToken | null) {
    try {
      const user = await UserServiceGet.getUserByID(id, token);
      return user;
    } catch (error) {
      console.log('Error loading user', error);
    }
  }
}

export default FormEditionManager;
