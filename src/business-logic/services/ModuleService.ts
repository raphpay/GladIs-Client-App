import IModule from '../model/IModule';
import ApiService from './APIService';

class ModuleService {
  private static instance: ModuleService | null = null;

  private constructor() {}

  static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  async getModules(): Promise<IModule> {
    try {
      const module = await ApiService.get<IModule>('modules');
      return module;
    } catch (error) {
      console.error('Error getting modules', error);
      throw error;
    }
  }

  // TODO: Define additional methods for updating, deleting modules, etc.
}

export default ModuleService;
