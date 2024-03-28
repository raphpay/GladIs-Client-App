export default interface IPasswordResetToken {
  id?: string;
  token?: string;
  userID: IUserID,
  expiresAt: Date
}

interface IUserID {
  id: string
}