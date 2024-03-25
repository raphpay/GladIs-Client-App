import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../../assets/styles/reminders/CalendarStyles';

import CalendarHeader from './CalendarHeader';

interface Event {
  name: string;
  // Add other event properties as needed, e.g., id, description, etc.
}

interface EventsByDate {
  [key: string]: Event[];
}

function Calendar(): React.JSX.Element {
  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const daysItems = Array.from({ length: 7 }, (_, i) => i + 1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formattedMonthYearDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Determine what day of the week the month starts on, correctly adjusting for a Monday start
  const startDayOfMonth = new Date(year, month).getDay();
  
  // Determine what day of the week the month starts on, adjusting for a Monday start
  // const adjustedStartDay = startDayOfMonth === 0 ? 1 : startDayOfMonth - 1;
  const adjustedStartDay = startDayOfMonth === 0 ? 6 : startDayOfMonth - 1;

  // Create an array for the blank spaces before the first day of the month
  const blankDays = Array(adjustedStartDay).fill(null);

  // For ending blanks, ensure we're calculating the number correctly
  // Create an array for the blank spaces after the last day of the month
  const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
  const adjustedLastDay = lastDayOfMonth === 0 ? 6 : lastDayOfMonth - 1;
  // No adjustment needed if the month already ends on a Monday (adjustedLastDay == 0 in this setup)
  const endingBlankDays = adjustedLastDay == 6 ? 0 : 6 - adjustedLastDay;
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

  function formatDay(day: number): string {
    const baseDate = new Date(Date.UTC(2021, 0, 4)); // Starting from a Monday to ensure correct order
    const dayDate = new Date(baseDate);
    dayDate.setDate(dayDate.getDate() + day - 1);
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(dayDate);
    return dayName;
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
            <Text style={styles.moreEventsText}>{t('calendar.more')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  
  // TODO: Check scroll behavior
  return (
    <View style={styles.container}>
      <CalendarHeader currentDate={currentDate} setCurrentDate={setCurrentDate}/>
      <View style={styles.daysOfWeekContainer}>
        {daysItems.map((day) => (
          <Text key={day} style={styles.dayOfWeek}>{formatDay(day)}</Text>
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