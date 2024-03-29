import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  lineContainer: {
    height: 55,
    width: '100%',
    justifyContent: 'center',
  },
  lineRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  mailText: {
    fontFamily: Fonts.poppinsSemiBold,
    fontWeight: Fonts.regular,
  },
  dateText: {
    fontFamily: Fonts.poppinsLight,
    fontWeight: Fonts.regular,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4,
    zIndex: -10
  },
  tokenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenText: {
    fontSize: 20,
    fontFamily: Fonts.poppinsSemiBold,
  },
  copyIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default styles;