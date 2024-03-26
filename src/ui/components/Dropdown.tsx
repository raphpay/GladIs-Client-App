import React from 'react';
import {
  DimensionValue
} from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import styles from '../assets/styles/components/DropdownStyles';

type DropdownProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  items: ItemType<number>[]; // Add the required type argument to the ItemType generic type
  onSelect: (item: ItemType<number>) => void;
  onOpen: () => void;
  containerWidth: DimensionValue;
  containerHeight?: DimensionValue;
};

function Dropdown(props: DropdownProps): React.JSX.Element {
  const {
    open, setOpen,
    value, setValue,
    items,
    onSelect,
    onOpen,
    containerWidth,
    containerHeight,
  } = props;

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      onSelectItem={onSelect}
      onOpen={onOpen}
      containerStyle={{ ...styles.containerStyle, width: containerWidth, height: containerHeight}}
      dropDownDirection="BOTTOM"
      style={styles.dropdownStyle}
      textStyle={styles.dropdownText}
    />
  );
}

export default Dropdown;