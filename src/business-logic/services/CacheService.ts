import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Represents a cache service that provides methods for storing, retrieving, and removing values from cache.
 */
class CacheService {
  private static instance: CacheService | null = null;

  private constructor() {}

  /**
   * Returns the singleton instance of the CacheService class.
   * @returns The singleton instance of the CacheService class.
   */
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Stores a value in the cache.
   * @param key - The key under which the value will be stored.
   * @param value - The value to be stored.
   */
  async storeValue<T>(key: string, value: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('Error when trying to cache data for key:', key, 'with:', value, error);
    }
  }

  /**
   * Retrieves a value from the cache.
   * @param key - The key of the value to be retrieved.
   * @returns A promise that resolves to the retrieved value, or null if the value is not found.
   */
  async retrieveValue<T>(key: string): Promise<string | T | null> {
    let item: T | string | null = null;
    try {
      const storedItem = await AsyncStorage.getItem(key);
      if (storedItem) {
        item = JSON.parse(storedItem);
      }
    } catch (error) {
      throw new Error(`Error retrieving value from cache : ${error}`);
    }
    return item;
  }

  /**
   * Removes a value from the cache.
   * @param key - The key of the value to be removed.
   */
  async removeValueAt(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing cached value at:', key, error);
    }
  }

  /**
   * Clears the entire cache.
   */
  async clearStorage() {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.log('Error clearing cache', error);
    }
  }
}

export default CacheService;
