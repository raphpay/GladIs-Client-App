export default interface IProcessus {
  id?: string,
  title: string,
  number: number,
  folder: Folder,
  userID: IUserID,
}

export interface IProcessusInput {
  title: string,
  number: number,
  folder: Folder,
  userID: string,
}

export enum Folder {
  SystemQuality = 'systemQuality',
  Record ='record'
}

interface IUserID {
  id: string
}