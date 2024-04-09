import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  navigationMainContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 30,
    paddingBottom: 16,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  appIcon: {
    paddingLeft: 60,
    paddingTop: 16,
  },
  currentPageTitle: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: Fonts.semiBold,
    fontFamily: Fonts.bikoBold
  },
  navigationHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 12,
    fontWeight: Fonts.regular,
    fontFamily: Fonts.poppinsLight,
    paddingRight: 4
  },
  navigationButtonContainer: {
    flexDirection: 'row',
  },
  chevron: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  }
});

export default styles;