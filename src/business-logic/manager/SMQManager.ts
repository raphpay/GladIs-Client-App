// Models
import ISurvey, { ISurveyInput } from '../model/ISurvey';
import IToken from '../model/IToken';
// Enums
import CacheKeys from '../model/enums/CacheKeys';
// Services
import CacheService from '../services/CacheService';
import SurveyService from '../services/SurveyService';

class SMQManager {
  private static instance: SMQManager;
  private surveyData: ISurvey | null = null;
  private clientID: string | null = null;
  private hasFilledForm: boolean | null = null;

  private constructor() {}

  // Singleton
  static getInstance(): SMQManager {
    if (!SMQManager.instance) {
      SMQManager.instance = new SMQManager();
    }
    return SMQManager.instance;
  }

  // Setters
  set(survey: ISurvey) {
    this.surveyData = survey;
  }

  setClientID(id: string) {
    this.clientID = id;
  }

  setHasFilledForm(value: boolean) {
    if (this.hasFilledForm !== false) {
      this.hasFilledForm = value;
    }
  }

  resetSurvey() {
    this.surveyData = null;
  }

  // Getters
  async getSurvey(): Promise<ISurvey | null> {
    let survey: ISurvey | null = this.surveyData;
    if (!this.surveyData) {
      const cacheValue = (await CacheService.getInstance().retrieveValue(
        CacheKeys.clientSurvey,
      )) as ISurvey;
      console.log('not', cacheValue);
      if (cacheValue) {
        survey = cacheValue;
      } else {
        survey = null;
      }
    }
    return survey;
  }

  getClientID(): string | null {
    return this.clientID;
  }

  getHasFilledForm(): boolean | null {
    return this.hasFilledForm;
  }

  // Methods
  /**
   * Adds new fields to the survey data. If the survey does not exist, it creates a new survey object.
   * If the survey exists, it merges the new data with the existing survey data, adding only new properties.
   * @param newData - An object containing the new data fields to be added to the survey.
   * @returns A promise that resolves when the survey data is successfully saved into cache.
   * @throws If an error occurs while saving the survey data into cache.
   */
  async addFields(newData: any) {
    if (!this.surveyData) {
      // Create new survey object if it doesn't exist
      const survey: ISurvey = {
        value: JSON.stringify(newData),
        client: {
          id: this.clientID || '',
        },
      };
      this.surveyData = survey;
    } else {
      // Merge new data with existing survey data
      const value = JSON.parse(this.surveyData.value);

      // Only add properties from newData to value if they don't already exist in value
      for (const key in newData) {
        if (!value.hasOwnProperty(key)) {
          value[key] = newData[key];
        }
      }

      this.surveyData.value = JSON.stringify(value);
    }
    await this.saveIntoCache();
  }

  // Async Methods
  /**
   * Sends the current survey data to the API for saving.
   * Clears the survey data and cache after successful submission.
   * @param token - The authentication token (optional).
   * @returns A promise that resolves when the survey data is successfully sent to the API and the local cache is cleared.
   * @throws If an error occurs during the API request or cache removal.
   */
  async sendToAPI(token: IToken | null) {
    if (this.surveyData) {
      const value: string = this.surveyData.value;
      const id = this.clientID as string;
      if (value) {
        try {
          const input: ISurveyInput = {
            value,
            clientID: id,
          };
          console.log('input', input);
          await SurveyService.getInstance().createSurvey(input, token);
          this.surveyData = null;
          await CacheService.getInstance().removeValueAt(
            CacheKeys.clientSurvey,
          );
        } catch (error) {
          throw error;
        }
      }
    }
  }

  // Step One
  async continueAfterStepOne(
    companyName: string,
    companyHistory: string,
    managerName: string,
    medicalDevices: string,
    clients: string,
    area: string,
  ) {
    const stepOneData = {
      '2': companyName,
      '3': companyHistory,
      '4': managerName,
      '5': medicalDevices,
      '6': clients,
      '7': area,
    };
    await this.addFields(stepOneData);
    let isFilled = false;
    isFilled =
      companyName !== '' &&
      companyHistory !== '' &&
      managerName !== '' &&
      medicalDevices !== '' &&
      clients !== '' &&
      area !== '';
    this.setHasFilledForm(isFilled);
  }

  // Step Two
  async continueAfterStepTwo(
    activity: string,
    qualityGoals: string,
    hasOrganizationalChart: boolean,
    headquartersAddress: string,
    phoneNumber: string,
    email: string,
    fileID: string | undefined,
  ) {
    const stepTwoData = {
      '8': activity,
      '9': qualityGoals,
      '10': hasOrganizationalChart,
      '11': headquartersAddress,
      '12': phoneNumber,
      '13': email,
      organizationalChartID: fileID,
    };
    await this.addFields(stepTwoData);
    let isFilled = false;
    isFilled =
      activity !== '' &&
      qualityGoals !== '' &&
      headquartersAddress !== '' &&
      phoneNumber !== '' &&
      email !== '';
    this.setHasFilledForm(isFilled);
  }

  // Step Three
  async continueAfterStepThree(
    website: string,
    auditorsName: string,
    auditorsFunction: string,
    approversName: string,
    approversFunction: string,
  ) {
    const stepThreeData = {
      '14': website,
      '15': auditorsName,
      '16': auditorsFunction,
      '17': approversName,
      '18': approversFunction,
    };
    await this.addFields(stepThreeData);
    let isFilled = false;
    isFilled =
      website !== '' &&
      auditorsName !== '' &&
      auditorsFunction !== '' &&
      approversName !== '' &&
      approversFunction !== '';
    this.setHasFilledForm(isFilled);
  }

  // Management Screen
  async continueAfterManagementScreen(processusPilotName: string) {
    const managementData = {
      '19': processusPilotName,
    };
    await this.addFields(managementData);
    let isFilled = false;
    isFilled = processusPilotName !== '';
    this.setHasFilledForm(isFilled);
  }

  // Measurement and Improvement Screen
  async continueAfterMeasurementAndImprovementScreen(
    processusPilotName: string,
  ) {
    const measurementAndImprovementData = {
      '20': processusPilotName,
    };
    await this.addFields(measurementAndImprovementData);
    let isFilled = false;
    isFilled = processusPilotName !== '';
    this.setHasFilledForm(isFilled);
  }

  // Fabrication Development Screen
  async continueAfterFabricationDevelopmentScreen(
    processusPilotName: string,
    productionFlux: string,
    productIdentifications: string,
    productPreservation: string,
    productTracking: string,
  ) {
    const fabricationDevelopmentData = {
      '21': processusPilotName,
      '22': productionFlux,
      '23': productIdentifications,
      '24': productPreservation,
      '25': productTracking,
    };
    await this.addFields(fabricationDevelopmentData);
    let isFilled = false;
    isFilled =
      processusPilotName !== '' &&
      productionFlux !== '' &&
      productIdentifications !== '' &&
      productPreservation !== '' &&
      productTracking !== '';
    this.setHasFilledForm(isFilled);
  }

  // Client Relation Screen
  async continueAfterClientRelationScreen(
    processusPilotName: string,
    orderDeliveryNoteID: string | undefined,
    productsSoldID: string | undefined,
  ) {
    const clientRelationData = {
      '26': processusPilotName,
      '27': orderDeliveryNoteID,
      '28': productsSoldID,
    };
    await this.addFields(clientRelationData);
    let isFilled = false;
    isFilled =
      processusPilotName !== '' &&
      orderDeliveryNoteID !== undefined &&
      productsSoldID !== undefined;
    this.setHasFilledForm(isFilled);
  }

  // Buy Screen
  async continueAfterBuyScreen(processusPilotName: string) {
    const buyData = {
      '29': processusPilotName,
    };
    await this.addFields(buyData);
    let isFilled = false;
    isFilled = processusPilotName !== '';
    this.setHasFilledForm(isFilled);
  }

  // Resources Management Screen
  async continueAfterResourcesManagementScreen(processusPilotName: string) {
    const resourcesManagementData = {
      '30': processusPilotName,
    };
    await this.addFields(resourcesManagementData);
    let isFilled = false;
    isFilled = processusPilotName !== '';
    this.setHasFilledForm(isFilled);
  }

  // Regulatory Affairs Screen
  async continueAfterRegulatoryAffairsScreen(
    processusPilotName: string,
    safeguardMeasures: string,
  ) {
    const regulatoryAffairsData = {
      '31': processusPilotName,
      '32': safeguardMeasures,
    };
    await this.addFields(regulatoryAffairsData);
    let isFilled = false;
    isFilled = processusPilotName !== '' && safeguardMeasures !== '';
    this.setHasFilledForm(isFilled);
  }

  // Cache
  async saveIntoCache() {
    const survey = await this.getSurvey();
    await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, survey);
  }
}

export default SMQManager;
