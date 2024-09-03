/**
 * Service class for managing pending users.
 */
class PendingUserService {
  private static instance: PendingUserService | null = null;
  private baseRoute = 'pendingUsers';

  constructor() {}

  /**
   * Returns the singleton instance of the PendingUserService class.
   * @returns The singleton instance of the PendingUserService class.
   */
  static getInstance(): PendingUserService {
    if (!PendingUserService.instance) {
      PendingUserService.instance = new PendingUserService();
    }
    return PendingUserService.instance;
  }
}

export default PendingUserService;
