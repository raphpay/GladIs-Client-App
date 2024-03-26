export interface IEvent {
  id?: string;
  name: string;
  date: Date;
  clientID: string | null;
}