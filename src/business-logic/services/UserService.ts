import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class UserService {
  private static instance: UserService | null = null;
  private baseRoute = 'users';

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
      const createdUser = await APIService.post<IUser>(this.baseRoute, user);
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // READ
  async getUsers(): Promise<IUser[]> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const users = await APIService.get<IUser[]>(this.baseRoute, castedToken.value);
      return users;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByID(id: string | undefined): Promise<IUser> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const user = await APIService.get<IUser>(`${this.baseRoute}/${id}`, castedToken?.value);
      return user;
    } catch (error) {
      console.error('Error getting user by id:', id, error);
      throw error;
    }
  }

  // UPDATE
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const castedUserID = userID as string;
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      await APIService.put(`${this.baseRoute}/${castedUserID}/changePassword`, { currentPassword, newPassword }, castedToken.value);
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  async setUserFirstConnectionToFalse() {
    try {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const castedUserID = userID as string;
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      await APIService.put(`${this.baseRoute}/${castedUserID}/setFirstConnectionToFalse`, null, castedToken.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
      throw error;
    }
  }

  // DELETE
}

export default UserService;
