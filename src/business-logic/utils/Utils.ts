/**
 * Utility class containing various helper functions.
 */
class Utils {
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
}

export default Utils;
