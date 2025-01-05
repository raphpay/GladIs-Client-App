export default interface IFolder {
  id?: string;
  title: string;
  number: number;
  sleeve: Sleeve;
  userID: IUserID | string;
  category: string;
}

export interface IFolderInput {
  title: string;
  number: number;
  sleeve: Sleeve;
  userID: string;
  path?: string;
}

export interface IFolderUpdateInput {
  title?: string;
  number?: number;
}

export interface IFolderMultipleInput {
  inputs: IFolder[];
  userID: string;
}

export interface IFolderUserRecordInput {
  path: string;
}

export enum Sleeve {
  SystemQuality = 'systemQuality',
  Record = 'record',
}

export enum FolderCategory {
  QualityManual = 'qualityManual',
  Process = 'process',
  Custom = 'custom',
}

interface IUserID {
  id: string;
}
