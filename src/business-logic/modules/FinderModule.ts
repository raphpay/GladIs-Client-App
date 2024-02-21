import { NativeModules } from "react-native";

class FinderModule {
  private static instance: FinderModule | null = null;
  private constructor() {}
  private static currentModule = NativeModules.FinderModule;

  static getInstance(): FinderModule {
    if (!FinderModule.instance) {
      FinderModule.instance = new FinderModule();
    }
    return FinderModule.instance;
  }

  async pickPDF(): Promise<string> {
    return new Promise((resolve) => {
      NativeModules.FinderModule.pickPDFFile((res: any) => {
        resolve(res as string);
      });
    });
  }
}

export default FinderModule;
