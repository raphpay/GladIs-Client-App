import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  additionalMentions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mentionText: {
    fontSize: 10,
    fontFamily: Fonts.poppinsLight,
    color: Colors.inactive
  },
});

export default styles;