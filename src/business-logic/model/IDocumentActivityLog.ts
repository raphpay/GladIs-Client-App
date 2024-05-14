import DocumentLogAction from "./enums/DocumentLogAction";

export default interface IDocumentActivityLog {
  id?: string;
  name: string;
  actorUsername: string;
  actionDate: string;
  documentID?: IDocumentID;
  formID?: IFormID;
  clientID: IClientID;
  action: DocumentLogAction;
  actorIsAdmin: boolean;
}

interface IDocumentID {
  id: string
}

interface IFormID {
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
  documentID?: string;
  formID?: string;
}

export interface IDocumentActivityLogPaginatedOutput {
  logs: IDocumentActivityLog[];
  pageCount: number;
}