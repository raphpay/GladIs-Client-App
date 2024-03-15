import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 34,
    fontFamily: Fonts.bikoBold
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  },
  image: {
    maxWidth: 55,
    maxHeight: 75,
    resizeMode: 'contain'
  }
});

export default styles;