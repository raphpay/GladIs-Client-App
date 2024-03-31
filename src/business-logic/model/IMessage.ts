export interface IMessage {
  id?: string;
  title: string;
  content: string;
  dateSent: Date;
  sender: IUserID;
  senderMail: string;
  receiver: IUserID;
  receiverMail: string;
}

interface IUserID {
  id: string;
}