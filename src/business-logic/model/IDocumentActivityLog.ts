import DocumentLogAction from "./enums/DocumentLogAction";

export default interface IDocumentActivityLog {
  id?: string;
  name: string;
  actorUsername: string;
  actionDate: string;
  documentID: IDocumentID;
  clientID: IClientID;
  action: DocumentLogAction;
}

interface IDocumentID {
  id: string
}

interface IClientID {
  id: string
}

export interface IDocumentActivityLogInput {
  action: DocumentLogAction;
  actorIsAdmin: boolean;
  actorID: string;
  clientID: string;
  documentID: string;
}