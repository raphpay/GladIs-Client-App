import { Platform } from "react-native";
import PlatformName from "../model/enums/PlatformName";

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
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        // If successful -> return with blob
        xhr.onload = function () {
          resolve(xhr.response);
        };
        
        // reject on error
        xhr.onerror = function () {
          reject(new Error('uriToBlob failed'));
        };
        
        // Set the response type to 'blob' - this means the server's response 
        // will be accessed as a binary object
        xhr.responseType = 'blob';
        
        // Initialize the request. The third argument set to 'true' denotes 
        // that the request is asynchronous
        xhr.open('GET', uri, true);
        
        // Send the request. The 'null' argument means that no body content is given for the request
        xhr.send(null);
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
  static async blobToData(blob: Blob): Promise<string> {
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
   * Converts a file URI to a base64 string.
   * @param uri - The URI of the file to convert.
   * @returns A Promise that resolves to the base64 string representation of the file.
   * @throws If the conversion fails.
   */
  static async getFileBase64FromURI(uri: string): Promise<string> {
    let blob: Blob;
    let data: string = '';
    if (Platform.OS === PlatformName.Android) {
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

  
  /**
   * Checks if a given value is a valid number.
   * @param value - The value to check.
   * @returns `true` if the value is a valid number, `false` otherwise.
   */
  static isANumber(value: string) {
    return !isNaN(Number(value));
  }
  
  /**
  * Formats a number with a leading zero if it is less than 10.
  * @param number - The number to format.
  * @returns A string representation of the number with a leading zero if it is less than 10.
  */
  static formatWithLeadingZero(number: number): string {
    let stringNumber = number.toString();
    if (number < 10) {
      stringNumber = `0${number}`;
    }
    return stringNumber;
  }

  /**
   * Formats a month number to its corresponding name.
   * @param month - The month number to format.
   * @returns The name of the month.
   */
  static formatMonth(month: number): string {
    const newDate = new Date(new Date().getFullYear(), month, 1);
    return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(newDate);
  }

  /**
   * Formats a date to a string in the format 'YYYY-MM-DD'.
   * @param date - The date to format.
   * @returns A string representation of the date in the format 'YYYY-MM-DD'.
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are zero-indexed, so add 1 for correct month number
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  /**
   * Formats a date to a string in the format 'DD/MM/YYYY'.
   * @param date - The date to format.
   * @returns A string representation of the date in the format 'DD/MM/YYYY'.
   */
  static formatStringDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', }).format(date);
  }

  static formatDateForComparison(date: Date): Date {
    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
  }

  /**
   * Formats a day number to its corresponding name.
   * @param day - The day number to format.
   * @returns The name of the day.
   */
  static formatDay(day: number): string {
    const baseDate = new Date(Date.UTC(2021, 0, 4)); // Starting from a Monday to ensure correct order
    const dayDate = new Date(baseDate);
    dayDate.setDate(dayDate.getDate() + day - 1);
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(dayDate);
    return dayName;
  }

  /**
   * Formats a time to a string in the format 'HH:MM'.
   * @param date - The date to format.
   * @returns A string representation of the time in the format 'HH:MM'.
   */
  static formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Handle error keys to display the correct error message.
   * @param keys - The keys of the error messages.
   * @returns The title of the error message to display.
   */
  static handleErrorKeys(keys: string[]): string {
    let errorTitle = 'errors.api.badRequest.default';
    if (keys.length > 0) {
      if (keys.includes('badRequest.email.invalid')) {
        if (keys.includes('badRequest.phoneNumber.invalid')) {
          errorTitle = 'errors.api.badRequest.phoneAndEmail';
        } else {
          errorTitle = 'errors.api.badRequest.email.invalid';
        }
      } else if (keys.includes('badRequest.phoneNumber.invalid')) {
        errorTitle = 'errors.api.badRequest.phoneNumber.invalid';
      }
    }
    return errorTitle;
  }

  /**
   * Checks if a value is a valid number.
   * @param value - The value to check.
   * @returns `true` if the value is a valid number, `false` otherwise.
   */
  isANumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  /**
   * Converts a JSON object to a CSV string.
   * @param items - The JSON object to convert to CSV.
   * @returns The CSV string representation of the JSON object.
   */
  static convertJSONToCSV(items: any | any[]) {
    // Convert single object to array
    if (!Array.isArray(items)) {
      items = [items];
    }
  
    // Rest of the method remains the same
    const header = Object.keys(items[0]);
    const headerString = header.join(',');
    // handle null or undefined values here
    const replacer = (key: string, value: string) => value ?? '';
    const rowItems = items.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    // join header and body, and break into separate lines
    const csv = [headerString, ...rowItems].join('\r\n');
    return csv;
  }

  static getJSFormatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}

export default Utils;