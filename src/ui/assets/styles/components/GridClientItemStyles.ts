import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: 'white',
    margin: 10,
    minWidth: 150,
    height: 200,
    overflow: 'hidden',
  },
  blueBox: {
    flex: 1,
    height: 160,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: Colors.inactive,
    padding: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  },
});

export default styles;