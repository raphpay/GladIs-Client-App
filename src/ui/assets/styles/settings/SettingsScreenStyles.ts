import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  additionalMentions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 10,
    left: 0,
    zIndex: -1
  },
  mentionText: {
    fontSize: 10,
    fontFamily: Fonts.poppinsLight,
    color: Colors.inactive
  },
  actionContainer: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
    margin: 4
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginHorizontal: 4
  },
  text: {
    fontSize: 14,
    margin: 4
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default styles;