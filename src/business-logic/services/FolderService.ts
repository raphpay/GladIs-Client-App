import IFolder, {
  IFolderInput,
  IFolderMultipleInput,
  IFolderUpdateInput,
} from '../model/IFolder';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing documents.
 */
class FolderService {
  private static instance: FolderService | null = null;
  private baseRoute = 'folders';

  private constructor() {}

  /**
   * Gets the singleton instance of the FolderService class.
   * @returns The singleton instance of the FolderService class.
   */
  static getInstance(): FolderService {
    if (!FolderService.instance) {
      FolderService.instance = new FolderService();
    }
    return FolderService.instance;
  }

  // CREATE
  /**
   * Creates a new process.
   * @param input The input for the process to create.
   * @param token The token to use for authentication.
   * @returns The created process.
   * @throws An error if the process could not be created.
   */
  async create(input: IFolderInput, token: IToken | null): Promise<IFolder> {
    try {
      const newFolder = await APIService.post<IFolderInput>(
        this.baseRoute,
        input,
        token?.value as string,
      );
      const folder = this.convertInputToFolder(newFolder);
      return folder;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates multiple processes.
   * @param input The input for the processes to create.
   * @param token The token to use for authentication.
   * @throws An error if the processes could not be created.
   */
  async createMultiple(
    input: IFolderMultipleInput,
    token: IToken | null,
  ): Promise<IFolder[]> {
    try {
      const createdFolders = await APIService.post<IFolder[]>(
        `${this.baseRoute}/multiple`,
        input,
        token?.value as string,
      );
      return createdFolders;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  /**
   * Updates a process.
   * @param input The input for the process to update.
   * @param processID The ID of the process to update.
   * @param token The token to use for authentication.
   * @returns The updated process.
   * @throws An error if the process could not be updated.
   */
  async update(
    input: IFolderUpdateInput,
    processID: string,
    token: IToken | null,
  ): Promise<IFolder> {
    try {
      const updatedProcess = (await APIService.put(
        `${this.baseRoute}/${processID}`,
        input,
        token?.value as string,
      )) as IFolder;
      return updatedProcess;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  /**
   * Deletes a process.
   * @param processID The ID of the process to delete.
   * @param token The token to use for authentication.
   * @throws An error if the process could not be deleted.
   */
  async delete(processID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(
        `${this.baseRoute}/${processID}`,
        token?.value as string,
      );
    } catch (error) {
      throw error;
    }
  }

  private convertInputToFolder(input: IFolderInput): IFolder {
    return {
      title: input.title,
      number: input.number,
      sleeve: input.sleeve,
      userID: {
        id: input.userID,
      },
    };
  }
}

export default FolderService;
