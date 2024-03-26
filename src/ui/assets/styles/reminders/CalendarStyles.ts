import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
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
    zIndex: 1000
  },
  monthYearText: {
    fontFamily: Fonts.poppinsSemiBold,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  },
  dayText: {
    fontFamily: Fonts.poppinsLight,
    textAlign: 'right',
    fontSize: 16,
  },
  eventIndicator: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
  },
  eventName: {
    fontSize: 12,
    color: 'white',
  },
  moreEventsText: {
    fontSize: 12,
    color: 'blue',
  },
  todayButton: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 50,
    borderColor: Colors.inactive
  },
  todayText: {
    fontFamily: Fonts.poppinsLight,
  },
  arrowButton: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    width: 35,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.inactive
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default styles;