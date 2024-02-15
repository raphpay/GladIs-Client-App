import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    backgroundColor: Colors.light,
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
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    margin: 8
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
});

export default styles;