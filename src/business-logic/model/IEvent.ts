export interface IEvent {
  id?: string;
  name: string;
  date: Date;
  clientID: IClientID | null;
}

interface IClientID {
  id: string;
}

export interface EventsByDate {
  [key: string]: IEvent[];
}
