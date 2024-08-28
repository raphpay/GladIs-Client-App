import { NativeModules } from "react-native";

/**
 * Represents the FinderModule class.
 */
class FinderModule {
  private static instance: FinderModule | null = null;

  private constructor() {}

  /**
   * Returns the instance of FinderModule.
   * If an instance already exists, it returns the existing instance.
   * Otherwise, it creates a new instance and returns it.
   * @returns The instance of FinderModule.
   */
  static getInstance(): FinderModule {
    if (!FinderModule.instance) {
      FinderModule.instance = new FinderModule();
    }
    return FinderModule.instance;
  }

  /**
   * Picks a PDF file using the FinderModule.
   * @returns A promise that resolves to the path of the picked PDF file.
   */
  async pickPDF(): Promise<string> {
    return new Promise((resolve) => {
      NativeModules.FinderModule.pickPDFFile((res: any) => {
        resolve(res as string);
      });
    });
  }

  /**
   * Picks an image using the FinderModule.
   * @returns A promise that resolves to the path of the picked image.
   */
  async pickImage(): Promise<string> {
    return new Promise((resolve) => {
      NativeModules.FinderModule.pickImage((res: any) => {
        resolve(res as string);
      });
    });
  }

  async pickCSV(): Promise<string> {
    return new Promise((resolve) => {
      NativeModules.FinderModule.pickCSVFile((res: any) => {
        resolve(res as string);
      });
    });
  }
}

export default FinderModule;
