class Utils {
  static isPhoneValid(input: string): boolean {
    const regex: RegExp = /^(0|\+33|0033)[1-9]([-. ]?[0-9]{2}){4}$/;
    const isValid: boolean = regex.test(input);
    return isValid;
  }
  
  static isEmailValid(input: string): boolean {
    const regex: RegExp = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;
    const isValid: boolean = regex.test(input);
    return isValid ;
  }
}

export default Utils;