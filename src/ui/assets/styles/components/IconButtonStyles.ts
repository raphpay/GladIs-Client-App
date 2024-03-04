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
    backgroundColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    width: 20,
    height: 20,
    padding: 4
  },
  textButton: {
    fontSize: 14,
    padding: 4,
    color: Colors.white,
    fontFamily: Fonts.poppinsLight
  },
});

export default styles;
