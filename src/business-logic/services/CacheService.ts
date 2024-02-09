import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheService {
  private static instance: CacheService | null = null;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async storeValue<T>(key: string, value: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('Error when trying to cache data for key:', key, 'with:', value, error);
    }
  }

  async retrieveValue<T>(key: string): Promise<string | T | null> {
    let item: T | string | null = null;
    try {
      const storedItem = await AsyncStorage.getItem(key);
      item = JSON.parse(storedItem ?? '');
    } catch (error) {
      console.log('Error retrieving value to cache for key:', key, error);
    }
    return item;
  }

  async removeValueAt(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing cached value at:', key, error);
    }
  }

  async clearStorage() {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.log('Error clearing cache', error);
    }
  }
}

export default CacheService;
