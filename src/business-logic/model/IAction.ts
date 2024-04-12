export default interface IAction {
  title: string;
  onPress: () => void;
  isDisabled?: boolean;
  isDestructive?: boolean;
}


export interface IActionItem {
  id: string;
  number: number;
  name: string;
  color?: string;
  screenDestination?: string;
}