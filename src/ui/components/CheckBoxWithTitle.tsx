import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../assets/styles/components/CheckBoxWithTitleStyles';

type CheckboxWithTitleProps = {
  title: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckboxWithTitle = (props: CheckboxWithTitleProps) => {

  const { title, isChecked, setIsChecked } = props;

  function check() {
    setIsChecked(!isChecked)
  }
  
  return (
    <TouchableOpacity onPress={check} style={styles.container}>
      <View style={[styles.checkbox, isChecked && styles.checked]} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxWithTitle;
