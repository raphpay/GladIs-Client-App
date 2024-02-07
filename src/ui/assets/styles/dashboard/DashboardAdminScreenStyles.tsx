import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    marginHorizontal: 16,
    marginBottom: 16,
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
  innerTopClientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '75%',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: Colors.secondary
  },
  innerBottomClientContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '25%',
  },
  clientContainer: {
    height: 75,
    width: 190,
    borderRadius: 10,
    margin: 4,
    backgroundColor: Colors.inactive
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
  textInput: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    width: '30%',
    padding: 10,
    margin: 8,
  },
});

export default styles;