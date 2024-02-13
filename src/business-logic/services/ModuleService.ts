import IModule from '../model/IModule';
import APIService from './APIService';

class ModuleService {
  private static instance: ModuleService | null = null;

  private constructor() {}

  static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  async getModules(): Promise<IModule[]> {
    try {
      const modules = await APIService.get<IModule[]>('modules');
      return modules;
    } catch (error) {
      console.error('Error getting modules', error);
      throw error;
    }
  }
}

export default ModuleService;
