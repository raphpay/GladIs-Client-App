import ISurvey, { ISurveyInput } from '../model/ISurvey';
import IToken from '../model/IToken';
import APIService from './APIService';

/**
 * Represents a service for managing documents.
 */
class SurveyService {
  private static instance: SurveyService | null = null;
  private baseRoute = 'surveys';

  private constructor() {}

  /**
   * Gets the singleton instance of the SurveyService class.
   * @returns The singleton instance of the SurveyService class.
   */
  static getInstance(): SurveyService {
    if (!SurveyService.instance) {
      SurveyService.instance = new SurveyService();
    }
    return SurveyService.instance;
  }

  /**
   * Creates a new survey.
   * @param survey - The survey to create.
   * @param token - The authentication token (optional).
   * @throws If an error occurs while creating the survey.
   * @returns A promise that resolves when the survey is created.
  */
  async createSurvey(survey: ISurveyInput, token: IToken | null): Promise<void> {
    try {
      await APIService.post<ISurveyInput>(this.baseRoute, survey, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all surveys.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to an array of surveys.
   * @throws If an error occurs while retrieving the surveys.
   */
  async getAll(token: IToken | null): Promise<ISurvey[]> {
    try {
      const url = `${this.baseRoute}/`;
      const surveys = await APIService.get<ISurvey[]>(url, token?.value as string);
      return surveys;
    } catch (error) {
      console.log('Error getting surveys:', error);
      throw error;
    }
  }

  /**
   * Retrieves a survey by ID.
   * @param surveyID - The ID of the survey to retrieve.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the survey with the specified ID.
   * @throws If an error occurs while retrieving the survey.
  */
  async update(surveyID: string, value: string, token: IToken | null): Promise<ISurvey> {
    try {
      const url = `${this.baseRoute}/${surveyID}`;
      console.log('he', url );
      const updatedSurvey = await APIService.put(url, { value }, token?.value as string);
      return updatedSurvey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a survey by ID.
   * @param surveyID - The ID of the survey to retrieve.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves to the survey with the specified ID.
   * @throws If an error occurs while retrieving the survey.
  */
  async delete(surveyID: string, token: IToken | null): Promise<void> {
    try {
      const url = `${this.baseRoute}/${surveyID}`;
      await APIService.delete(url, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default SurveyService;
