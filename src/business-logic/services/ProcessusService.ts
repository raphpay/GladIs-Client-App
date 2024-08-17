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

  // TODO: Add documentation
  // CREATE
  async create(input: IProcessusInput, token: IToken | null): Promise<void> {
    try {
      await APIService.post<IProcessusInput>(this.baseRoute, input, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  async update(input: IProcessusUpdateInput, processID: string, token: IToken | null): Promise<IProcessus> {
    try {
      const updatedProcess = await APIService.put(`${this.baseRoute}/${processID}`, input, token?.value as string) as IProcessus;
      return updatedProcess;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async delete(processID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${processID}`, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default ProcessusService;
