import { Platform } from "react-native";

/**
 * Utility class containing various helper functions.
 */
class Utils {
  /**
   * Checks if a phone number is valid.
   * @param input - The phone number to validate.
   * @returns A boolean indicating whether the phone number is valid or not.
   */
  static isPhoneValid(input: string): boolean {
    const regex: RegExp = /^(0|\+33|0033)[1-9]([-. ]?[0-9]{2}){4}$/;
    const isValid: boolean = regex.test(input);
    return isValid;
  }
  
  /**
   * Checks if an email address is valid.
   * @param input - The email address to validate.
   * @returns A boolean indicating whether the email address is valid or not.
   */
  static isEmailValid(input: string): boolean {
    const regex: RegExp = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;
    const isValid: boolean = regex.test(input);
    return isValid;
  }

  /**
 * Function to convert a URI to a Blob object
 * @param {string} uri - The URI of the file
 * @returns {Promise} - Returns a promise that resolves with the Blob object
 */
  private static async uriToBlob(uri: string): Promise<Blob> {
    try {
      console.log('uriToBlob1');
      const xhr = new XMLHttpRequest();
      console.log('uriToBlob2');
      
      return new Promise((resolve, reject) => {
        // If successful -> return with blob
        xhr.onload = function () {
          console.log('uriToBlob3');

          resolve(xhr.response);
          console.log('uriToBlob4', xhr.response );
        };
        
        // reject on error
        xhr.onerror = function () {
          console.log('uriToBlob5');
          reject(new Error('uriToBlob failed'));
          console.log('uriToBlob6');
        };
        
        // Set the response type to 'blob' - this means the server's response 
        // will be accessed as a binary object
        console.log('uriToBlob7');
        xhr.responseType = 'blob';
        console.log('uriToBlob8');
        
        // Initialize the request. The third argument set to 'true' denotes 
        // that the request is asynchronous
        console.log('uriToBlob9');
        xhr.open('GET', uri, true);
        console.log('uriToBlob10');
        
        // Send the request. The 'null' argument means that no body content is given for the request
        console.log('uriToBlob11');
        xhr.send(null);
        console.log('uriToBlob12');
      });
    } catch (error) {
      throw new Error('uriToBlob failed');
    }
  };

  
  /**
   * Converts a Blob object to a base64 string.
   * @param blob - The Blob object to convert.
   * @returns A Promise that resolves to the base64 string representation of the Blob.
   * @throws If the conversion fails.
   */
  private static async blobToData(blob: Blob): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1]; // Extract base64 string from data URL
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('blobToData failed');
    }
  }
  
  /**
   * Checks if a password is valid.
   * @param input - The password to validate.
   * @returns A boolean indicating whether the password is valid or not.
   */
  static async getFileBase64FromURI(uri: string): Promise<string> {
    let blob: Blob;
    let data: string = '';
    if (Platform.OS === 'android') {
      blob = await this.uriToBlob(uri);
    } else {
      const response = await fetch(uri);
      blob = await response.blob();
    }
    data = await this.blobToData(blob);
    return data;
  }

  /**
   * Changes the MIME type of a base64 string.
   * @param base64String - The base64 string to modify.
   * @param newMimeType - The new MIME type to set.
   * @returns The modified base64 string with the new MIME type.
   */
  static changeMimeType(base64String: string, newMimeType: string): string {
    const mimeTypeRegex = /^data:(.*?);base64,(.*)$/;
    const matches = base64String.match(mimeTypeRegex);
    if (matches && matches.length === 3) {
      const [, mimeType, data] = matches;
      return `data:${newMimeType};base64,${data}`;
    }
    return base64String;
  }
}

export default Utils;