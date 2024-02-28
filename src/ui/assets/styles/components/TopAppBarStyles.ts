import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
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
    flexDirection: 'row'
  }
});

export default styles;