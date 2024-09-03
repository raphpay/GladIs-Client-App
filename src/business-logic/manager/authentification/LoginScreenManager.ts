import { IEventInput } from "../../model/IEvent";
import IToken from "../../model/IToken";
import { ILoginTryOutput } from "../../model/IUser";

import AuthenticationService from "../../services/AuthenticationService/AuthenticationService";
import UserServicePost from "../../services/UserService/UserService.post";
import UserServicePut from "../../services/UserService/UserService.put";

/**
 * A class to handle login screen logic
 */
class LoginScreenManager {
  private static instance: LoginScreenManager;

  private constructor() {}

  // Singleton
  static getInstance(): LoginScreenManager {
    if (!LoginScreenManager.instance) {
      LoginScreenManager.instance = new LoginScreenManager();
    }
    return LoginScreenManager.instance;
  }

  async login(identifier: string, password: string): Promise<IToken> {
    try {
      const token = await AuthenticationService.getInstance().login(identifier, password);
      return token;
    } catch (error) {
      throw error;
    }
  }

  async updateUserConnectionAttempts(identifier: string): Promise<ILoginTryOutput> {
    try {
      const output = await UserServicePost.getUserLoginTryOutput(identifier);
      const tryAttempsCount = await UserServicePut.blockUserConnection(output.id as string);
      output.connectionFailedAttempts = tryAttempsCount;
      return output;
    } catch (error) {
      throw error;
    }
  }

  async handleTryAttemptCount(tryOutput: ILoginTryOutput) {
    const count = tryOutput.connectionFailedAttempts || 0;
    if (count >= 5) {
      if (count === 5) {
        sendMaxLoginEvent(tryOutput);
      }
      displayToast(t('errors.api.unauthorized.login.connectionBlocked'), true);
    } else {
      displayToast(t('errors.api.unauthorized.login'), true);
    }
  }

  async sendMaxLoginEvent(tryOutput: ILoginTryOutput) {
    try {
      const event: IEventInput = {
        name: `${t('login.tooManyAttempts.eventName')} ${identifier} : ${tryOutput.email}`,
        date: Date.now(),
        clientID: tryOutput.id ?? '0',
      }
      await EventService.getInstance().createMaxAttemptsEvent(event);
    } catch (error) {
      console.log('Error sending max attempts event', error );
    }
  }
}

export default LoginScreenManager;
