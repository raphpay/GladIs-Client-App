import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TextInput
} from 'react-native';

type SearchTextInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean,
  placeholder?: string,
};

function SearchTextInput(props: SearchTextInputProps): React.JSX.Element {

  const { t } = useTranslation();

  const {
    searchText,
    setSearchText,
    editable,
    placeholder = t('components.searchTextInput.placeholder')
  } = props;

  return (
    <TextInput
      value={searchText}
      onChangeText={setSearchText}
      placeholder={placeholder}
      style={styles.textInput}
      editable={editable}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '30%',
    padding: 10,
    margin: 8,
  },
});

export default SearchTextInput;