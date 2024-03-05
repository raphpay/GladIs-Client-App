import IModule from "./IModule";
import PendingUserStatus from "./enums/PendingUserStatus";

export default interface IPendingUser {
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
  modules?: IModule[];
  status: PendingUserStatus;
  logoPath?: string;
}
