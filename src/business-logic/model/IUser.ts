import IModule from "./IModule";
import UserType from "./enums/UserType";

export default interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  email: string;
  products?: string | null;
  numberOfEmployees?: number | null;
  numberOfUsers?: number | null;
  salesAmount?: number | null;
  username?: string;
  password?: string;
  firstConnection?: boolean;
  userType: UserType;
  modules?: IModule[];
  isBlocked?: boolean;
  isConnectionBlocked?: boolean;
  connectionFailedAttempts?: number;
}

export interface EmailInput {
  email: string
}

export interface ILoginTryOutput {
  id?: string;
  isConnectionBlocked?: boolean;
  connectionFailedAttempts?: number;
  email: string;
}

export interface IUserUpdateInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}