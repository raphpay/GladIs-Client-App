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
});

export default styles;