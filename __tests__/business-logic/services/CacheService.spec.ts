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
    it('should retrieve a stored string value from AsyncStorage', async () => {
      const key = 'testKey';
      const expectedValue = 'testValue';
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(JSON.stringify(expectedValue));
  
      const result = await CacheService.getInstance().retrieveValue<string>(key);
  
      expect(result).toEqual(expectedValue);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
    });
  
    it('should retrieve a stored object value from AsyncStorage', async () => {
      const key = 'testKey';
      const expectedValue = { prop1: 'value1', prop2: 'value2' };
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(JSON.stringify(expectedValue));
  
      const result = await CacheService.getInstance().retrieveValue<typeof expectedValue>(key);
  
      expect(result).toEqual(expectedValue);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
    });
  
    it('should return null if no value is found for the given key', async () => {
      const key = 'nonExistentKey';
      AsyncStorage.getItem = jest.fn().mockResolvedValueOnce(null);
  
      const result = await CacheService.getInstance().retrieveValue<string>(key);
  
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
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
