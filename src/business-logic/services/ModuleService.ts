import IModule from '../model/IModule';
import APIService from './APIService';

class ModuleService {
  private static instance: ModuleService | null = null;
  private baseRoute = 'modules';

  private constructor() {}

  static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  // READ
  async getModules(): Promise<IModule[]> {
    try {
      const modules = await APIService.get<IModule[]>(this.baseRoute);
      return modules;
    } catch (error) {
      console.error('Error getting modules', error);
      throw error;
    }
  }

  async getModuleByID(id: string): Promise<IModule> {
    try {
      const module = await APIService.get<IModule>(`${this.baseRoute}/${id}`);
      return module;
    } catch (error) {
      console.error('Error getting modules', error);
      throw error;
    }
  }
}

export default ModuleService;
