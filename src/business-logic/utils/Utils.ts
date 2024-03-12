
/**
 * Utility class containing helper methods for common operations.
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
   * Checks if a password is valid.
   * @param input - The password to validate.
   * @returns A boolean indicating whether the password is valid or not.
   */
  static async getFileBase64FromURI(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1]; // Extract base64 string from data URL
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    });
  }
}

export default Utils;