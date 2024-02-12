import APIService from '../../../src/business-logic/services/APIService';
import ModuleService from '../../../src/business-logic/services/ModuleService';

jest.mock('../../../src/business-logic/services/APIService');

describe('ModuleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getModules', () => {
    it('should fetch modules successfully', async () => {
      const mockModules = [{ id: '1', name: 'Module 1' }, { id: '2', name: 'Module 2' }];
      (APIService.get as jest.Mock).mockResolvedValue(mockModules);

      const moduleService = ModuleService.getInstance();
      const result = await moduleService.getModules();

      expect(APIService.get).toHaveBeenCalledWith('modules');
      expect(result).toEqual(mockModules);
    });

    it('should throw an error if fetching modules fails', async () => {
      const mockError = new Error('Failed to fetch modules');
      (APIService.get as jest.Mock).mockRejectedValue(mockError);

      const moduleService = ModuleService.getInstance();

      await expect(moduleService.getModules()).rejects.toThrow(mockError);

      expect(APIService.get).toHaveBeenCalledWith('modules');
    });
  });
});
