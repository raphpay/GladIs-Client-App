  import IUser from '../model/IUser';
import ApiService from './apiService';

  class UserService {
    private static instance: UserService | null = null;

    private constructor() {}

    static getInstance(): UserService {
      if (!UserService.instance) {
        UserService.instance = new UserService();
      }
      return UserService.instance;
    }

    static async createUser(user: IUser): Promise<IUser> {
      try {
        const createdUser = await ApiService.post<IUser>('users', user);
        return createdUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    }

    static async getUserById(userId: string): Promise<IUser> {
      try {
        const user = await ApiService.get<IUser>(`users/${userId}`);
        return user;
      } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
      }
    }

    // TODO: Define additional methods for updating, deleting users, etc.
  }

  export default UserService;
