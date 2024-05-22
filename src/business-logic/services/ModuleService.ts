import IModule from '../model/IModule';

/**
 * Represents a service for managing modules.
 */
class ModuleService {
  private static instance: ModuleService | null = null;
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
}

export default ModuleService;
