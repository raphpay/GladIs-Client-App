/**
 * The APIService class provides methods for making HTTP requests to an API.
 */
// import { LOCAL_IP_ADDRESS } from "../../../protected-contants";
import { Platform } from "react-native";
import HttpMethod from "../model/enums/HttpMethod";

// const API_BASE_URL = `http://${LOCAL_IP_ADDRESS}:8080/api`;
const API_BASE_URL = 'http://localhost:8080/api';


class APIService {
  /**
   * Sends a GET request to the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @param token - Optional token for authentication.
   * @param params - Optional query parameters to include in the request.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
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
        method: HttpMethod.GET,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.log('Error fetching data:', error);
      throw error;
    }
  }

  /**
   * Sends a POST request to the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @param data - The data to include in the request body.
   * @param token - Optional token for authentication.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
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
        method: HttpMethod.POST,
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            if (responseData && responseData.reason) {
                errorMessage = responseData.reason;
            }
        }
        throw new Error(errorMessage);
      }

      return await response.json() as T;
    } catch (error) {
      console.log('Error posting data:', error);
      throw error;
    }
  }

  /**
   * Sends a login request to the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @param username - The username for authentication.
   * @param password - The password for authentication.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
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
        method: HttpMethod.POST,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.log('Error posting data:', error);
      throw error;
    }
  }

  /**
   * Sends a PUT request to the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @param data - The data to include in the request body.
   * @param token - Optional token for authentication.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
  static async put(endpoint: string, data: any = {}, token?: string): Promise<any> {
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
        method: HttpMethod.PUT,
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            if (responseData && responseData.reason) {
                errorMessage = responseData.reason;
            }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.log('Error updating data:', error);
      throw error;
    }
  }

  /**
   * Sends a DELETE request to the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @param token - Optional token for authentication.
   * @throws An error if the request fails.
   */
  static async delete(endpoint: string, token?: string) {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const headers: Record<string, string> = {};
  
      // Include token in headers if provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(url, {
        method: HttpMethod.DELETE,
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.log('Error deleting data:', error);
      throw error;
    }
  }  

  /**
   * Sends a GET request to download a file from the specified endpoint.
   * @param endpoint - The API endpoint to send the request to.
   * @returns A Promise that resolves to the downloaded file data.
   * @throws An error if the request fails.
   */
  static async download(endpoint: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        method: HttpMethod.GET,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const base64Data = reader.result as string; // Cast result to string
              // console.log('base64Data',base64Data );
              const base64String = base64Data.split(',')[1]; // Extract Base64 string after the comma
              const result = Platform.OS === 'macos' ? base64Data : base64Data;
              resolve(result);
          };
          reader.onerror = reject; // Reject promise on error
          reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.log('Error downloading data:', error);
      throw error;
    }
  }
}

export default APIService;
