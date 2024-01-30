import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme
} from 'react-native';

import { Colors } from '../../components/colors';
import DashboardAdminScreen from './DashboardAdminScreen';
import DashboardClientScreen from './DashboardClientScreen';

type DashboardScreenProps = {
  // TODO: Change this accordingly with the userType
  isAdmin: boolean;
};

function DashboardScreen(props: DashboardScreenProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      {
        props.isAdmin ? <DashboardAdminScreen /> : <DashboardClientScreen />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10
  },
  // Components
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
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

export default DashboardScreen;