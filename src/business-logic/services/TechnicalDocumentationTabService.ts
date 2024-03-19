import ITechnicalDocTab from '../model/ITechnicalDocumentationTab';
import IToken from '../model/IToken';

import APIService from './APIService';

/**
 * Service class for managing technical documentation tabs.
 */
class TechnicalDocumentationTabService {
  private static instance: TechnicalDocumentationTabService | null = null;
  private baseRoute = 'technicalDocumentationTabs';

  private constructor() {}

  /**
   * Returns the singleton instance of TechnicalDocumentationTabService.
   * @returns The singleton instance of TechnicalDocumentationTabService.
   */
  static getInstance(): TechnicalDocumentationTabService {
    if (!TechnicalDocumentationTabService.instance) {
      TechnicalDocumentationTabService.instance = new TechnicalDocumentationTabService();
    }
    return TechnicalDocumentationTabService.instance;
  }

  /**
   * Creates a new technical documentation tab.
   * @param tab - The technical documentation tab to create.
   * @param token - The authentication token.
   * @returns A promise that resolves to the created technical documentation tab.
   * @throws If an error occurs while creating the tab.
   */
  async createTab(tab: ITechnicalDocTab, token: IToken | null): Promise<ITechnicalDocTab> {
    try {
      const createdTab = await APIService.post<ITechnicalDocTab>(this.baseRoute, tab, token?.value);
      return createdTab;
    } catch (error) {
      console.log('Error creating tab:', error);
      throw error;
    }
  }
}

export default TechnicalDocumentationTabService;
