import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme
} from 'react-native';

import {
  Colors,
} from '../components/colors';

type DocumentsAppProps = {
  setShowDocumentsScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DocumentsScreen(props: DocumentsAppProps): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateBack() {
    props.setShowDocumentsScreen(false)
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <TouchableOpacity onPress={navigateBack}>
        <Text>Retour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentsScreen;