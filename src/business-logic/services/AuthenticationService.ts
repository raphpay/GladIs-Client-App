import AuthenticationResult from '../model/AuthenticationResult';
import IModule from '../model/IModule';
import IPendingUser from '../model/IPendingUser';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class AuthenticationService {
  private static instance: AuthenticationService | null = null;

  private constructor() {}

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  // Login
  async login(username: string, password: string): Promise<IToken> {
    let token: IToken;
    try {
      token = await APIService.login<IToken>('tokens/login', username, password);
      await CacheService.getInstance().storeValue<string>(CacheKeys.currentUserID, token.user.id);
      await CacheService.getInstance().storeValue<IToken>(CacheKeys.currentUserToken, token);
      return token
    } catch (error) {
      console.log('Error logging user with username:', username, error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserID);
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserToken);
    } catch (error) {
      console.error('Error logging user out', error);
      throw error;
    }
  }

  // Authentication check
  async checkAuthentication(): Promise<AuthenticationResult> {
    let authResult: AuthenticationResult = { token: null, firstConnection: true };
    try {
      const cachedToken = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserToken) as IToken;
      const token = await APIService.get<IToken>(`tokens/${cachedToken.id}`);
      const cachedUserID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
      const user = await APIService.get<IUser>(`users/${cachedUserID}`, token.value);
      authResult.firstConnection = user.firstConnection;
      if (token.user.id === cachedUserID) {
        authResult.token = token
      }
    } catch (error) {
      console.log('Error checking user authentication status', error);
      throw error;
    }

    return authResult;
  }

  // Ask for an account
  async askForSignUp(pendingUser: IPendingUser, modules: IModule[]) {
    try {
      const userAdded = await APIService.post<IPendingUser>('pendingUsers', pendingUser);
      await this.addModulesToPendingUser(modules, userAdded);
    } catch (error) {
      console.log('Error asking for sign up for user', pendingUser, error);
      throw error;
    }
  }

  async createPermanentUser(pendingUser: IPendingUser, token: IToken): Promise<IUser> {
    let newUser: IUser;
    try {
      const userID = pendingUser.id as string;
      newUser = await APIService.post<IUser>(`pendingUsers/${userID}/convertToUser`, {}, token.value)
      return newUser
    } catch (error) {
      console.log('Error converting pending user', pendingUser, 'to user', error);
      throw error;
    }
  }

  private async addModulesToPendingUser(modules: IModule[], pendingUser: IPendingUser) {

    for (const module of modules) {
      const userID = pendingUser.id as string;
      const moduleID = module.id as string;
      try {
        await APIService.post(`pendingUsers/${userID}/modules/${moduleID}`)
      } catch (error) {
        console.log('Error adding module', moduleID, 'to user', userID, error);
        throw error;
      }
    }
  }
}

export default AuthenticationService;
