const API_BASE_URL = 'http://localhost:8080/api';

class APIService {
  static async get<T>(endpoint: string, token?: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Include token in headers if provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
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

  static async post<T>(endpoint: string, data: any = {}, token?: string): Promise<T> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Include token in headers if provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
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

  static async login<T>(endpoint: string, username: string, password: string): Promise<T> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const Buffer = require("buffer").Buffer;
      let encodedAuth = new Buffer(`${username}:${password}`).toString("base64");

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
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

export default APIService;
