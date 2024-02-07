import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'gray',
    marginRight: 10,
  },
  checked: {
    backgroundColor: 'blue', // Change to your desired color
    borderColor: 'blue', // Change to your desired color
  },
});

export default styles;