import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
    maxHeight: Dimensions.get('window').height * 0.7, // Max height to prevent overflowing on smaller screens
    maxWidth: Dimensions.get('window').width * 0.7, // Max height to prevent overflowing on smaller screens
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;