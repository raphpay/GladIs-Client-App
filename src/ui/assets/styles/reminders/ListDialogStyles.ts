import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  eventButton: {
    flexDirection: 'row',
  },
  eventText: {
    fontFamily: Fonts.poppinsLight,
    color: Colors.primary
  },
  archivedIcon: {
    marginRight: 10,
    width: 20,
    height: 20
  },
});

export default styles;