import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

import {
  Colors,
} from '../components/colors';

type AppIconProps = {
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  return (
    <View style={[styles.appIcon, props.style, { backgroundColor: Colors.primary }]}>
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
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default AppIcon;