import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Utils from '../../../business-logic/utils/Utils';

import CalendarHeader from './CalendarHeader';

import styles from '../../assets/styles/reminders/CalendarStyles';


interface Event {
  name: string;
  // Add other event properties as needed, e.g., id, description, etc.
}

interface EventsByDate {
  [key: string]: Event[];
}

type CalendarProps = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
};
function Calendar(props: CalendarProps): React.JSX.Element {
  const { t } = useTranslation();

  const { currentDate, setCurrentDate, setShowDialog } = props;

  // State to store the timestamp of the last tap
  const [lastTap, setLastTap] = useState<number | null>(null)

  const daysItems = Array.from({ length: 7 }, (_, i) => i + 1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

  function doubleTapDayCell(day: number) {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // milliseconds

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Reset lastTap
      setLastTap(null);
      // Perform action on double tap
      setShowDialog(true);
    } else {
      // Update the lastTap timestamp
      setLastTap(now);
      // Optional: Perform action on single tap
      // ...
    }
  }

  function DayCellContent(day: number, dayEvents: Event[]) {
    return (
      <>
        <View key={`DayCellContent-view-${day}`} style={styles.dayTextContainer}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
        {dayEvents.slice(0, 2).map((event, index) => (
          <TouchableOpacity key={index} onPress={() => console.log('open event')}>
            <Text style={styles.eventName}>{event.name}</Text>
          </TouchableOpacity>
        ))}
        {dayEvents.length > 2 && (
          <TouchableOpacity key={`DayCellContent-touchable-${day}`}>
            <Text style={styles.moreEventsText}>{t('calendar.more')}</Text>
          </TouchableOpacity>
        )}
      </>
    )
  }

  function DayCell(day: number, dayEvents: Event[]) {
    return (
      <>
        {
          dayEvents.length > 0 ? (
            <View
              key={`DayCell-view-${day}`} 
              style={styles.dayCell} 
            >
              {DayCellContent(day, dayEvents)}
            </View> 
          ) : (
            <TouchableOpacity
              key={`DayCell-touchable-${day}`} 
              style={styles.dayCell}
              onPress={() => doubleTapDayCell(day)}
              >
              {DayCellContent(day, dayEvents)}
            </TouchableOpacity>
          )
        }
      </>
    );
  }
  
  // TODO: Check scroll behavior
  return (
    <View style={styles.container}>
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <View style={styles.daysOfWeekContainer}>
        {daysItems.map((day) => (
          <Text key={day} style={styles.dayOfWeek}>{Utils.formatDay(day)}</Text>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {blankDays.map((_, index) => (
          <Text key={`start-blank-${index}`} style={styles.day}></Text>
        ))}
        {daysArray.map(day => {
          const dayKey = Utils.formatDate(currentDate);
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