export default interface IProcessus {
  id?: string,
  title: string,
  number: number,
  folder: Folder,
  userID: IUserID,
}

enum Folder {
  SystemQuality = 'systemQuality',
  Record ='record'
}

interface IUserID {
  id: string
}