import AsyncStorage from '@react-native-async-storage/async-storage';
import CacheService from '../../../src/business-logic/services/CacheService';

describe('CacheService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('storeValue', () => {
    it('should store a value in AsyncStorage', async () => {
      const setItemSpy = jest.spyOn(AsyncStorage, 'setItem').mockResolvedValueOnce(undefined);
      const cacheService = CacheService.getInstance();

      await cacheService.storeValue('testKey', 'testValue');

      expect(setItemSpy).toHaveBeenCalledWith('testKey', JSON.stringify('testValue'));
    });

    it('should handle errors when storing value', async () => {
      const error = new Error('AsyncStorage error');
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

      const cacheService = CacheService.getInstance();
      await cacheService.storeValue('testKey', 'testValue');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error when trying to cache data for key:', 'testKey', 'with:', 'testValue', error
      );
    });
  });

  describe('retrieveValue', () => {
    it('should retrieve a value from AsyncStorage', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(JSON.stringify('testValue'));
      const cacheService = CacheService.getInstance();

      const result = await cacheService.retrieveValue<string>('testKey');

      expect(result).toEqual('testValue');
    });

    it('should return null if no value is found', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null);
      const cacheService = CacheService.getInstance();

      const result = await cacheService.retrieveValue<string>('nonExistentKey');

      expect(result).toBeNull();
    });

    it('should handle errors when retrieving value', async () => {
      const error = new Error('AsyncStorage error');
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

      const cacheService = CacheService.getInstance();
      const result = await cacheService.retrieveValue<string>('testKey');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error retrieving value to cache for key:', 'testKey', error
      );
      expect(result).toBeNull();
    });
  });

  describe('removeValueAt', () => {
    it('should remove a value from AsyncStorage', async () => {
      const removeItemSpy = jest.spyOn(AsyncStorage, 'removeItem').mockResolvedValueOnce(undefined);
      const cacheService = CacheService.getInstance();

      await cacheService.removeValueAt('testKey');

      expect(removeItemSpy).toHaveBeenCalledWith('testKey');
    });

    it('should handle errors when removing value', async () => {
      const error = new Error('AsyncStorage error');
      jest.spyOn(AsyncStorage, 'removeItem').mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

      const cacheService = CacheService.getInstance();
      await cacheService.removeValueAt('testKey');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error removing cached value at:', 'testKey', error
      );
    });
  });

  describe('clearStorage', () => {
    it('should clear AsyncStorage', async () => {
      const clearSpy = jest.spyOn(AsyncStorage, 'clear').mockResolvedValueOnce(undefined);
      const cacheService = CacheService.getInstance();

      await cacheService.clearStorage();

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should handle errors when clearing storage', async () => {
      const error = new Error('AsyncStorage error');
      jest.spyOn(AsyncStorage, 'clear').mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation();

      const cacheService = CacheService.getInstance();
      await cacheService.clearStorage();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error clearing cache', error);
    });
  });
});
