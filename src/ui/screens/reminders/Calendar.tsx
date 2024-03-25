import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../../assets/styles/reminders/CalendarStyles';

interface Event {
  name: string;
  // Add other event properties as needed, e.g., id, description, etc.
}

interface EventsByDate {
  [key: string]: Event[];
}

function Calendar(): React.JSX.Element {

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formattedMonthYearDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);
  const formattedMonthDate = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(currentDate);
  const formattedYearDate = new Intl.DateTimeFormat('fr-FR', { year: 'numeric' }).format(currentDate);

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

  const events: EventsByDate = {
    '2024-03-05': [{name: 'Meeting'}, {name: 'Doctor'}, {name: 'Gym'}],
    '2024-03-15': [{name: 'Birthday'}],
    '2024-03-25': [{name: 'Conference'}, {name: 'Dinner'}, {name: 'Call'}, {name: 'Study'}],
  };

  // Helper function to format date
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  function goToNextMonth() {
    const nextMonth = new Date(year, month + 1, 1);
    setCurrentDate(nextMonth);
  }

  function goToPreviousMonth() {
    const previousMonth = new Date(year, month - 1, 1);
    setCurrentDate(previousMonth);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function DayCell(day: number, dayEvents: Event[]) {
    return (
      <View 
        key={`day-${day}`} 
        style={styles.dayCell} 
      >
        <TouchableOpacity style={styles.dayTextContainer} onPress={() => console.log('Open day')}>
          <Text style={styles.dayText}>{day}</Text>
        </TouchableOpacity>
        {dayEvents.slice(0, 2).map((event, index) => (
          <TouchableOpacity key={index} onPress={() => console.log('open event')}>
            <Text style={styles.eventName}>{event.name}</Text>
          </TouchableOpacity>
        ))}
        {dayEvents.length > 2 && (
          <TouchableOpacity onPress={() => {/* Handle showing more events */}}>
            <Text style={styles.moreEventsText}>More...</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function ArrowButton(side: 'left' | 'right') {
    return (
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={side === 'left' ? goToPreviousMonth : goToNextMonth}>
          <Text>{side === 'left' ? '<' : '>'}</Text>
      </TouchableOpacity>
    );
  }

  // TODO: Add translation for month names and today button
  // TODO: Add dropdown to select month and year
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYearText}>{formattedMonthYearDate}</Text>
        <View style={styles.headerButtons}>
          <View style={styles.dateButton}>
            <Text>{formattedMonthDate}</Text>
          </View>
          <View style={styles.dateButton}>
            <Text>{formattedYearDate}</Text>
          </View>
          <TouchableOpacity onPress={goToToday} style={styles.dateButton}>
            <Text>Today</Text>
          </TouchableOpacity>
          {ArrowButton('left')}
          {ArrowButton('right')}
        </View>
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
        {daysArray.map(day => {
          const dayKey = formatDate(year, month, day);
          const dayEvents = events[dayKey] || [];
          
          return (
            DayCell(day, dayEvents)
          );
        })}
        {endingBlanks.map((_, index) => (
          <Text key={`end-blank-${index}`} style={styles.day}></Text>
        ))}
      </View>
    </View>
  );
}

export default Calendar;