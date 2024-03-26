export interface IEvent {
  id: string;
  name: string;
  date: number;
  client: IClientID | null;
}

export interface IEventInput {
  name: string;
  date: number;
  clientID: string
}

interface IClientID {
  id: string;
}

export interface EventsByDate {
  [key: string]: IEvent[];
}
