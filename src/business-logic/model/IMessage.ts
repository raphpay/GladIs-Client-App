export interface IMessage {
  id?: string;
  title: string;
  content: string;
  dateSent: Date;
  sender: IUserID;
  receiver: IUserID;
}

interface IUserID {
  id: string;
}