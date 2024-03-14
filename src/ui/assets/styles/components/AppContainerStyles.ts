import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  upperContainer: {
    height: 104,
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.primary
  },
  innerContainer: {
    flex: 1,
    backgroundColor: Colors.light,
    shadowColor: Colors.black,
    shadowOffset: {width: -2, height: -4},
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  backButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    padding: 16
  },
  settingsButton: {
    paddingHorizontal: 8,
  },
});

export default styles;