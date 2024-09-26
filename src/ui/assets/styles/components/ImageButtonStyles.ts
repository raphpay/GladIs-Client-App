import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 4,
    resizeMode: 'contain',
  },
});

export default styles;
