import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 5,
    minWidth: 50,
  },
  midCell: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 5,
    minWidth: 50,
  },
  cellRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  },
  saveButton: {
    marginRight: 10,
  },
  headerCell: {
    flex: 1,
  },
  headerCellTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.poppinsSemiBold 
  }
});

export default styles;