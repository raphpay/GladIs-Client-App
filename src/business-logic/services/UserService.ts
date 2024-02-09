import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

interface LoginResult {
  user?: IUser;
  token?: IToken;
}


class UserService {
  private static instance: UserService | null = null;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
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
  async getUsers(token: IToken): Promise<IUser[]> {
    try {
      const users = await APIService.get<IUser[]>(`users`, token.value);
      return users;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByID(id: string | undefined, token: IToken): Promise<IUser> {
    try {
      const user = await APIService.get<IUser>(`users/${id}`, token.value);
      return user;
    } catch (error) {
      console.error('Error getting user by id:', id, error);
      throw error;
    }
  }

  // UPDATE
  async changePassword(currentPassword: string, newPassword: string, user: IUser, token: IToken) {
    try {
      const castedUserID = user.id as string;
      await APIService.put(`users/${castedUserID}/changePassword`, { currentPassword, newPassword }, token.value);
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  async setUserFirstConnectionToFalse(user: IUser, token: IToken) {
    try {
      const userID = user.id as string;
      await APIService.put(`users/${userID}/setFirstConnectionToFalse`, null, token.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
      throw error;
    }
  }

  // DELETE

  // Authentication
  async login(username: string, password: string): Promise<LoginResult> {
    let token: IToken;
    let userID: string;
    try {
      token = await APIService.login<IToken>('users/login', username, password);
      await CacheService.getInstance().storeValue(CacheKeys.currentUserToken, token);
      userID = token.user.id as string;
    } catch (error) {
      console.error('Error logging user with username:', username, error);
      throw error;
    }

    try {
      const user = await this.getUserByID(userID, token);
      await CacheService.getInstance().storeValue(CacheKeys.currentUserID, userID);
      return {user, token};
    } catch (error) {
      console.error('Error getting user after login with token:', token, error);
      throw error;
    }
  }

  async logout(token: IToken) {
    try {
      await APIService.delete(`users/${token.id}/logout`);
    } catch (error) {
      console.error('Error logging user out', error);
      throw error;
    }
  }
}

export default UserService;
