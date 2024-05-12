// Form
import IForm, { IFormCell, IFormInput, IFormUpdateInput } from "../model/IForm";
// Token
import IToken from "../model/IToken";
// User
import IUser from "../model/IUser";
// Services
import FormService from "../services/FormService";
import UserService from "../services/UserService";
import Utils from "../utils/Utils";

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
    // TODO: Export the title and the dates too
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
   * Saves the form
   * @param form The form to save
   * @param documentPath The document path
   * @param currentUser The current user
   * @param currentClient The current client
   * @param token The token
   * @throws Error if there is an error saving the form
   */
  async saveForm(
    form: IForm | undefined,
    documentPath: string,
    currentUser: IUser | undefined, currentClient: IUser | undefined,
    token: IToken | null
  ) {
    try {
      if (form) {
        // Update
        await this.updateForm(form, currentUser, token);
      } else {
        await this.createForm(documentPath, currentUser, currentClient, token);
      }
    } catch (error) {
      throw error;
    }
  }

  // Private Methods
  /**
   * Loads a user by ID
   * @param id The user ID
   * @param token The token
   */
  private async loadUser(id: string, token: IToken | null) {
    try {
      const user = await UserService.getInstance().getUserByID(id, token);
      return user;
    } catch (error) {
      console.log('Error loading user', error);
    }
  }

  /**
   * Creates a form
   * @param documentPath The document path
   * @param currentUser The current user
   * @param currentClient The current client
   * @param token The token
   * @throws Error if there is an error creating the form
   */
  private async createForm(
    documentPath: string,
    currentUser: IUser | undefined, currentClient: IUser | undefined,
    token: IToken | null
  ) {
    try {
      const newForm: IFormInput = {
        title: this.getFormTitle(),
        createdBy: currentUser?.id as string,
        value: FormEditionManager.getInstance().arrayToCsv(),
        path: documentPath,
        clientID: currentClient?.id as string,
      };
      await FormService.getInstance().create(newForm, token);
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
  private async updateForm(form: IForm, currentUser: IUser | undefined, token: IToken | null) {
    try {
      const updateUserID = currentUser?.id as string;
      const newForm: IFormUpdateInput = {
        updatedBy: updateUserID,
        value: this.arrayToCsv(),
      };
      await FormService.getInstance().update(form.id as string, newForm, token);
    } catch (error) {
      throw error;
    }
  }
}

export default FormEditionManager;
