import IToken from '../model/IToken';
import IUser from '../model/IUser';
import APIService from './APIService';

class UserService {
  private static instance: UserService | null = null;
  private static token: IToken | undefined = undefined;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  setToken(token: IToken) {
    UserService.token = token;
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
      const users = await APIService.get<IUser[]>(`users`, UserService.token?.value);
      return users;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<IUser> {
    try {
      const token = await APIService.login<IToken>('users/login', username, password);
      UserService.getInstance().setToken(token);
    } catch (error) {
      console.error('Error logging user with username:', username, error);
      throw error;
    }

    try {
      const userID = UserService.token?.user.id;
      const user = await APIService.get<IUser>(`users/${userID}`, UserService.token?.value);
      return user;
    } catch (error) {
      console.error('Error getting user after login with token:', UserService.token?.value, error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const userID = UserService.token?.user.id;
      await APIService.put(`users/${userID}/changePassword`, { currentPassword, newPassword }, UserService.token?.value)
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  // TODO: Define additional methods for updating, deleting users, etc.
}

export default UserService;
