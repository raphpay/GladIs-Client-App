import IModule from "./IModule";
import UserType from "./enums/UserType";

export default interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string | null;
  userType: UserType; // Define UserType type if it's not already defined
  modules?: IModule[]; // Define Module type if it's not already defined
}