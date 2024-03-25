import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  arrow: {
    fontSize: 24,
    padding: 10,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dayOfWeek: {
    width: '13%',
    textAlign: 'center',
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  dayCell: {
    width: '13%',
    height: 75,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  day: {
    width: '13%',
    textAlign: 'center',
    fontSize: 16,
  },
  dayTextContainer: {
    width: '100%',
    alignItems: 'flex-end'
  },
  dayText: {
    fontFamily: Fonts.poppinsLight,
    textAlign: 'center',
    fontSize: 16,
  },
  eventIndicator: {
    fontSize: 12,
    color: 'red', // Example: mark event days with a red dot
    paddingTop: 4,
  },
  eventName: {
    fontSize: 12,
    color: '#333',
  },
  moreEventsText: {
    fontSize: 12,
    color: 'blue',
  },
});

export default styles;