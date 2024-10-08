import { StyleSheet } from 'react-native';
import { Colors } from '../../../colors/colors';
import { Fonts } from '../../../fonts/fonts';

const styles = StyleSheet.create({
  // Containers
  folderContainer: {
    backgroundColor: Colors.inactive,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 75,
    borderRadius: 10,
    margin: 10,
  },
  // Components
  categoryTitle: {
    fontSize: 12,
    fontFamily: Fonts.poppinsSemiBold
  },
  adminButton: {
    marginHorizontal: 8,
    marginVertical: 4,
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