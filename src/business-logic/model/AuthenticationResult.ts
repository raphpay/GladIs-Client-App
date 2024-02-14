import IToken from "./IToken";

export default interface AuthenticationResult {
  token: IToken | null;
  firstConnection: boolean;
}