export default interface IPasswordResetToken {
  id?: string;
  token: string;
  user: IUserID
  expiresAt: Date
}

interface IUserID {
  id: string
}