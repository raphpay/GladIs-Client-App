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

export interface IUserID {
  id: string;
}

export interface IMessageInput {
  title: string;
  content: string;
  senderID: string;
  senderMail: string;
  receiverID: string;
  receiverMail: string;
}