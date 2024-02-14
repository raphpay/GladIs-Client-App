export default interface IToken {
  id?: string;
  value: string;
  user: IUserID
}

interface IUserID {
  id: string
}