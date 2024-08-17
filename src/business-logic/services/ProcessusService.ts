import IProcessus, { IProcessusInput, IProcessusUpdateInput } from "../model/IProcessus";
import IToken from "../model/IToken";
import APIService from "./APIService";

/**
 * Represents a service for managing documents.
 */
class ProcessusService {
  private static instance: ProcessusService | null = null;
  private baseRoute = 'processus';

  private constructor() {}

  /**
   * Gets the singleton instance of the ProcessusService class.
   * @returns The singleton instance of the ProcessusService class.
   */
  static getInstance(): ProcessusService {
    if (!ProcessusService.instance) {
      ProcessusService.instance = new ProcessusService();
    }
    return ProcessusService.instance;
  }

  // CREATE
  /**
   * Creates a new process.
   * @param input The input for the process to create.
   * @param token The token to use for authentication.
   * @returns The created process.
   * @throws An error if the process could not be created.
   */
  async create(input: IProcessusInput, token: IToken | null): Promise<void> {
    try {
      await APIService.post<IProcessusInput>(this.baseRoute, input, token?.value as string);
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
  async update(input: IProcessusUpdateInput, processID: string, token: IToken | null): Promise<IProcessus> {
    try {
      const updatedProcess = await APIService.put(`${this.baseRoute}/${processID}`, input, token?.value as string) as IProcessus;
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
      await APIService.delete(`${this.baseRoute}/${processID}`, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default ProcessusService;
