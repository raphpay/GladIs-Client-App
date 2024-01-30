import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Colors,
} from '../components/colors';

function AppIcon(): React.JSX.Element {

  return (
    <View style={[styles.appIcon, { backgroundColor: Colors.primary }]}>
      <Text style={{color: Colors.white }}>App Icon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appIcon: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 60,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default AppIcon;