import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  table: {
    marginTop: 20,
  },
  rowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cell: {
    flex: 1, // Adjust flex values to change the width of each cell
    textAlign: 'left', // Adjust text alignment as needed
  },
  headerCell: {
    fontWeight: 'bold',
  },
});

export default styles;