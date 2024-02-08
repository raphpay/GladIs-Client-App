// apiService.ts

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  static async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json() as T;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  static async post<T>(endpoint: string, data: any = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json() as T;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  // TODO: Add methods for other HTTP methods like PUT, DELETE, etc. as needed
}

export default ApiService;
