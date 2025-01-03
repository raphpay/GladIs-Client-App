import IVersionLog from '../model/IVersionLog';
import APIService from './APIService';

/**
 * Service class for managing document activity logs.
 */
class VersionLogService {
  private static instance: VersionLogService | null = null;
  private baseRoute = 'versionLogs';

  private constructor() {}

  /**
   * Returns the singleton instance of VersionLogService.
   * @returns The singleton instance of VersionLogService.
   */
  static getInstance(): VersionLogService {
    if (!VersionLogService.instance) {
      VersionLogService.instance = new VersionLogService();
    }
    return VersionLogService.instance;
  }

  /**
   * Fetches the version log.
   * @returns The version
   * @throws An error if the request fails.
   */
  async getVersionLog(): Promise<IVersionLog> {
    try {
      const versionLog = await APIService.get<IVersionLog>(this.baseRoute);
      return versionLog;
    } catch (error) {
      throw error;
    }
  }
}

export default VersionLogService;
