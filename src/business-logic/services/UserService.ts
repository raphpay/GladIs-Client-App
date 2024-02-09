import IToken from '../model/IToken';
import IUser from '../model/IUser';
import APIService from './APIService';

class UserService {
  private static instance: UserService | null = null;
  static token: IToken | undefined = undefined;

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

  // CREATE
  async createUser(user: IUser): Promise<IUser> {
    try {
      const createdUser = await APIService.post<IUser>('users', user);
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // READ
  async getUsers(): Promise<IUser[]> {
    try {
      const users = await APIService.get<IUser[]>(`users`, UserService.token?.value);
      return users;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByID(id: string | undefined): Promise<IUser> {
    try {
      const user = await APIService.get<IUser>(`users/${id}`, UserService.token?.value);
      return user;
    } catch (error) {
      console.error('Error getting user by id:', id, error);
      throw error;
    }
  }

  // Login
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
      const user = await this.getUserByID(userID);
      return user;
    } catch (error) {
      console.error('Error getting user after login with token:', UserService.token?.value, error);
      throw error;
    }
  }

  // UPDATE
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const userID = UserService.token?.user.id;
      await APIService.put(`users/${userID}/changePassword`, { currentPassword, newPassword }, UserService.token?.value);
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  async setUserFirstConnectionToFalse() {
    try {
      const userID = UserService.token?.user.id;
      await APIService.put(`users/${userID}/setFirstConnectionToFalse`, null, UserService.token?.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
      throw error;
    }
  }

  // DELETE
}

export default UserService;
