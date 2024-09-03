/**
 * Represents a service for managing user-related operations.
 */
class UserService {
  private static instance: UserService | null = null;
  private baseRoute = 'users';

  constructor() {}

  /**
   * Returns the singleton instance of the UserService class.
   * @returns The singleton instance of the UserService class.
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}

export default UserService;
