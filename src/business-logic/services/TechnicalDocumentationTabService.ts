import ITechnicalDocTab from '../model/ITechnicalDocumentationTab';
import IToken from '../model/IToken';

import APIService from './APIService';

class TechnicalDocumentationTabService {
  private static instance: TechnicalDocumentationTabService | null = null;
  private baseRoute = 'technicalDocumentationTabs';

  private constructor() {}

  static getInstance(): TechnicalDocumentationTabService {
    if (!TechnicalDocumentationTabService.instance) {
      TechnicalDocumentationTabService.instance = new TechnicalDocumentationTabService();
    }
    return TechnicalDocumentationTabService.instance;
  }

  // CREATE
  async createTab(tab: ITechnicalDocTab, token: IToken | null): Promise<ITechnicalDocTab> {
    try {
      const createdTab = await APIService.post<ITechnicalDocTab>(this.baseRoute, tab, token?.value);
      return createdTab;
    } catch (error) {
      console.error('Error creating tab:', error);
      throw error;
    }
  }
}

export default TechnicalDocumentationTabService;
