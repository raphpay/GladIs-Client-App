import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  // Containers
  categoryContainer: {
    borderRadius: 10,
    width: 148,
    height: 228,
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 8,
  },
  categoryImageContainer: {
    height: '75%'
  },
  categoryTextsContainer: {
    height: '25%',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 4,
    backgroundColor: Colors.inactive,
  },
  // Components
  categoryTitle: {
    fontSize: 12
  },
  categoryDescription: {
    fontSize: 10
  },
});

export default styles;