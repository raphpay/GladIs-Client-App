import IModule from '../model/IModule';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing modules.
 */
class ModuleService {
  private static instance: ModuleService | null = null;
  private baseRoute = 'modules';
  private modules: IModule[] = [
    {
      id: '1',
      name: 'documentManagement',
      index: 1,
    },
    {
      id: '2',
      name: 'tracking',
      index: 2,
    },
    {
      id: '3',
      name: 'reminders',
      index: 3,
    },
    {
      id: '4',
      name: 'chat',
      index: 4,
    }
  ];

  private constructor() {}

  /**
   * Gets the singleton instance of the ModuleService class.
   * @returns The singleton instance of the ModuleService class.
   */
  static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  /**
   * Retrieves all modules.
   * @returns An array of modules.
   */
  getModules(): IModule[] {
    return this.modules
  }

  /**
   * Retrieves all modules sorted by their order.
   * @returns A promise that resolves to an array of modules sorted by their order.
   * @throws If there was an error retrieving the modules.
   */
  async getSortedModules(token: IToken | null): Promise<IModule[]> {
    try {
      const modules = await APIService.get<IModule[]>(`${this.baseRoute}/sorted`, token?.value as string);
      return modules;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a module by its ID.
   * @param id - The ID of the module to retrieve.
   * @returns A promise that resolves to the module with the specified ID.
   * @throws If there was an error retrieving the module.
   */
  async getModuleByID(id: string): Promise<IModule> {
    try {
      const module = await APIService.get<IModule>(`${this.baseRoute}/${id}`);
      return module;
    } catch (error) {
      console.log('Error getting modules', error);
      throw error;
    }
  }
}

export default ModuleService;
