import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
} from '../components/colors';

type IconButtonProps = {
  title: string;
  icon: ImageSourcePropType;
  onClick: () => void;
};

function IconButton(props: IconButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity onPress={props.onClick}>
      <View style={[styles.container, { backgroundColor: Colors.primary}]}>
          <Image
            style={styles.icon}
            source={props.icon}
          />
        <Text style={styles.textButtonColor}>Ajouter un client</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    padding: 8
  },
  icon: {
    width: 20,
    height: 20,
    padding: 4
  },
  textButtonColor: {
    color: 'white',
    fontSize: 14,
    padding: 4
  },
});

export default IconButton;