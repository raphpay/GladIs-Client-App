  import IUser from '../model/IUser';
import APIService from './APIService';

class UserService {
  private static instance: UserService | null = null;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(user: IUser): Promise<IUser> {
    try {
      const createdUser = await APIService.post<IUser>('users', user);
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUsers(): Promise<IUser[]> {
    try {
      const users = await APIService.get<IUser[]>(`users`);
      return users;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // TODO: Define additional methods for updating, deleting users, etc.
}

export default UserService;
