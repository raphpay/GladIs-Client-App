import { IProcessusInput } from "../model/IProcessus";
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

  async create(input: IProcessusInput, token: IToken | null): Promise<void> {
    try {
      await APIService.post<IProcessusInput>(this.baseRoute, input, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default ProcessusService;
