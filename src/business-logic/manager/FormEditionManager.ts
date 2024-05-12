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
// TODO: Add documentation
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
  addColumn(): IFormCell[][] {
    let updatedGrid: IFormCell[][];

    updatedGrid = this.grid.map((row, index) => {
      const newCell = { id: Utils.generateUUID(), value: '', isTitle: index === 0 };
      return [...row, newCell];
    });

    return updatedGrid;
  }

  addRow() {
    if (this.grid[0].length > 0) {
      const newRow = Array(this.grid[0].length).fill({}).map(() => ({ id: Utils.generateUUID(), value: '', isTitle: false }));
      this.setGrid([...this.grid, newRow]);
    } else {
      console.log('Add column first');
    }
    return this.grid;
  }

  removeColumn() {
    const updatedGrid = this.grid.map(row => row.slice(0, -1));
    this.setGrid(updatedGrid);
  };

  removeRow() {
    const updatedGrid = this.grid.slice(0, -1);
    this.setGrid(updatedGrid);
  }

  updateCell(rowIndex: number, columnIndex: number, newText: string): IFormCell[][] {
    // Create a copy of the grid
    const newGrid = [...this.grid];
    console.log('new', newGrid );

    // Update the cell value in the copied grid
    // newGrid[rowIndex][columnIndex].value = newText;

    // // Update the state with the new grid
    // this.setGrid(newGrid);
    // return this.grid;
  };

  arrayToCsv() {
    // TODO: Export the title and the dates too
    const csv = this.grid.map(row => row.map(cell => cell.value).join(',')).join('\n');
    return csv;
  }

  // Async Methods
  async loadGrid(form: IForm | undefined) {
    if (form) {
      const gridFromCSV = Utils.csvToGrid(form.value);
      this.setGrid(gridFromCSV);
    }
  }

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
  private async loadUser(id: string, token: IToken | null) {
    try {
      const user = await UserService.getInstance().getUserByID(id, token);
      return user;
    } catch (error) {
      console.log('Error loading user', error);
    }
  }

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
