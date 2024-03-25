import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { IRootStackParams } from '../../../navigation/Routes';
import AppContainer from '../../components/AppContainer';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { navigation } = props;

  function goToNextMonth() {
    const nextMonth = new Date(year, month + 1, 1);
    setCurrentDate(nextMonth);
  }

  function goToPreviousMonth() {
    const previousMonth = new Date(year, month - 1, 1);
    setCurrentDate(previousMonth);
  }

  function navigateBack() {
    navigation.goBack();
  }

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Determine what day of the week the month starts on
  const startDayOfMonth = new Date(year, month).getDay();
  // Determine what day of the week the month starts on, adjusting for a Monday start
  const adjustedStartDay = startDayOfMonth === 0 ? 1 : startDayOfMonth - 1;

  // Create an array for the blank spaces before the first day of the month
  const blankDays = Array(adjustedStartDay).fill(null);

  // For ending blanks, ensure we're calculating the number correctly
  // Create an array for the blank spaces after the last day of the month
  const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
  const adjustedLastDay = lastDayOfMonth === 0 ? 6 : lastDayOfMonth - 1;
  const endingBlankDays = (7 - adjustedLastDay) % 7; // Ensuring non-negative length
  const endingBlanks = Array(endingBlankDays).fill(null);

  // Create an array for the days of the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Mock function to check if a day has events
  const hasEvents = (day: number) => {
    // Example: return true if the day is the 5th of any month
    return day === 5;
  };
  
  return (
    <AppContainer
      mainTitle='Reminders'
      showBackButton={true}
      showSearchText={false}
      showSettings={true}
      navigateBack={navigateBack}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Text style={styles.arrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text>{`${year} ${month + 1}`}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.monthText}>{`${months[month]} ${year}`}</Text> */}
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.dayOfWeek}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {blankDays.map((_, index) => (
            <Text key={`start-blank-${index}`} style={styles.day}></Text>
          ))}
          {daysArray.map(day => (
            <TouchableOpacity 
              key={`day-${day}`} 
              style={styles.dayCell} 
              onPress={() => console.log(`Events for ${day}`)}
            >
              <Text style={styles.dayText}>{day}</Text>
              {hasEvents(day) && <Text style={styles.eventIndicator}>•</Text>}
            </TouchableOpacity>
          ))}
          {endingBlanks.map((_, index) => (
            <Text key={`end-blank-${index}`} style={styles.day}></Text>
          ))}
        </View>
      </View>
    </AppContainer>
  );
}

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
  day: {
    width: '13%',
    textAlign: 'center',
    margin: 2,
    fontSize: 16,
  },
  dayCell: {
    width: '13%',
    height: 50, // Set a fixed height for the cells
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    margin: 2,
    borderWidth: 1, // Optional: add a border to each cell
    borderColor: '#ddd', // Light grey border
  },
  dayText: {
    textAlign: 'center',
    fontSize: 16,
  },
  eventIndicator: {
    fontSize: 12,
    color: 'red', // Example: mark event days with a red dot
    paddingTop: 4,
  },
});

export default RemindersScreen;