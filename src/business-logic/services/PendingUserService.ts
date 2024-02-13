import IPendingUser from '../model/IPendingUser';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class PendingUserService {
  private static instance: PendingUserService | null = null;

  private constructor() {}

  static getInstance(): PendingUserService {
    if (!PendingUserService.instance) {
      PendingUserService.instance = new PendingUserService();
    }
    return PendingUserService.instance;
  }

  // READ
  async getUsers(token: IToken): Promise<IPendingUser[]> {
    try {
      const pendingUsers = await APIService.get<IPendingUser[]>('pendingUsers', token.value);
      return pendingUsers;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByID(id: string | undefined): Promise<IUser> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const user = await APIService.get<IUser>(`users/${id}`, castedToken?.value);
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
      await APIService.put(`users/${castedUserID}/changePassword`, { currentPassword, newPassword }, castedToken.value);
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
      await APIService.put(`users/${castedUserID}/setFirstConnectionToFalse`, null, castedToken.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
      throw error;
    }
  }
}

export default PendingUserService;
