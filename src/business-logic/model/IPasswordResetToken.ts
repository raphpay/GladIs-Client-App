export default interface IPasswordResetToken {
  id?: string;
  token?: string;
  userID: IUserID,
  userEmail: string,
  expiresAt: Date
}

interface IUserID {
  id: string
}