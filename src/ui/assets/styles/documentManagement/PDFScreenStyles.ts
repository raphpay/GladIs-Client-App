import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  pageIndicatorButton: {
    marginHorizontal: 10,
  },
  pageIndicatorText: {
    marginHorizontal: 10,
    fontSize: Fonts.p,
    fontWeight: Fonts.regular,
    fontFamily: Fonts.poppinsLight,
  },
});

export default styles;
