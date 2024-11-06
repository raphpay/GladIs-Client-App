import { Platform } from 'react-native';
import { IFormCell } from '../model/IForm';
import PlatformName from '../model/enums/PlatformName';

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
  }

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

  // Utility function to read file content from a URI
  static async getCSVFromFile(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
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
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(','),
    );
    // join header and body, and break into separate lines
    const csv = [headerString, ...rowItems].join('\r\n');
    return csv;
  }

  /**
   * Generates a UUID.
   * @returns A UUID.
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /**
   * Converts a CSV string to a grid.
   * @param value - The CSV string to convert.
   * @returns The grid representation of the CSV string.
   */
  static csvToGrid(value: string): IFormCell[][] {
    const rows = value.split('\n');
    const grid = rows.map((row, rowIndex) => {
      const cells = row.split(',');
      return cells.map(cellValue => ({
        id: Utils.generateUUID(),
        value: cellValue,
        isTitle: rowIndex === 0,
      }));
    });
    return grid;
  }

  /**
   * Removes all whitespace characters (spaces, tabs, newlines) from the input string.
   * @param input - The string from which to remove whitespace.
   * @returns A new string without any whitespace.
   */
  static removeWhitespace(input: string): string {
    return input.replace(/\s+/g, '');
  }

  /**
   * Replaces all occurrences of a target string with a replacement string within the input string.
   * @param input - The string to perform the replacement on.
   * @param target - The substring to replace.
   * @param replacement - The string to replace the target with.
   * @returns A new string with all occurrences of the target string replaced by the replacement.
   */
  static replaceAllOccurrences(
    input: string,
    target: string,
    replacement: string,
  ): string {
    return input.split(target).join(replacement);
  }

  /**
   * Generates a random password of the specified length, ensuring at least one lowercase letter,
   * one uppercase letter, one number, and one special character.
   * Avoids ambiguous characters like '0', '1', 'l', and 'O'.
   *
   * @param length - The desired length of the generated password.
   * @returns A randomly generated password string.
   */
  static generatePassword(length: number): string {
    const lowerCaseLetters = 'abcdefghjkmnpqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const specialCharacters = '!@#$%^&*';

    const getRandomChar = (set: string) =>
      set[Math.floor(Math.random() * set.length)];

    let password = '';

    // Ensure at least one character from each required set
    password += getRandomChar(lowerCaseLetters);
    password += getRandomChar(upperCaseLetters);
    password += getRandomChar(numbers);
    password += getRandomChar(specialCharacters);

    // Fill the remaining characters
    const allCharacters =
      lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;
    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allCharacters);
    }

    // Shuffle the characters to ensure randomness
    const shuffledPassword = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return shuffledPassword;
  }

  /**
   * Removes the ".pdf" file extension from a file name if it exists (case-insensitive).
   * @param fileName - The name of the file to remove the ".pdf" extension from.
   * @returns The file name without the ".pdf" extension, or the original file name if no extension is found.
   */
  static removePdfExtension(fileName: string): string {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return fileName.slice(0, -4);
    }
    return fileName;
  }

  /**
   * Converts a Uint8Array into a string using the 'utf-8' encoding.
   * @param uint8Array - The Uint8Array to convert to a string.
   * @returns The decoded string representation of the Uint8Array.
   */
  static convertUIntArrayToString(uint8Array: Uint8Array): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(uint8Array);
  }

  /**
   * Removes the 'data:application/octet-stream;base64,' prefix from a base64 string if present.
   * @param base64String - The base64 string from which to remove the prefix.
   * @returns The base64 string without the prefix, or the original string if the prefix is not found.
   */
  static removeBase64Prefix(base64String: string): string {
    const prefix = 'data:application/octet-stream;base64,';
    if (base64String.startsWith(prefix)) {
      return base64String.replace(prefix, '');
    }
    return base64String;
  }
}

export default Utils;
