import { StyleSheet } from 'react-native';
import { Colors } from '../../../colors/colors';

const styles = StyleSheet.create({
  uploadActivityIndicator: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.inactive,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10000,
  },
});

export default styles;
