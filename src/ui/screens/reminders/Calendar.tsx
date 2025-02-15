import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { EventsByDate, IEvent } from '../../../business-logic/model/IEvent';
import DateUtils from '../../../business-logic/utils/DateUtils';

import CalendarHeader from './CalendarHeader';

import styles from '../../assets/styles/reminders/CalendarStyles';

type CalendarProps = {
  events: IEvent[];
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setShowCreateDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowListDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEventDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setDaysEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
};
function Calendar(props: CalendarProps): React.JSX.Element {
  const {
    events,
    setSelectedEvent,
    currentDate,
    setCurrentDate,
    setSelectedDate,
    setShowCreateDialog,
    setShowListDialog,
    setShowEventDialog,
    setDaysEvents,
  } = props;

  // Hooks
  const { t, i18n } = useTranslation();

  // States
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [localEvents, setLocalEvents] = useState<EventsByDate>({});

  // Constants
  const language: 'en' | 'fr' = i18n.language === 'fr' ? 'fr' : 'en';
  const daysItems = Array.from({ length: 7 }, (_, i) => i + 1);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Logic
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

  // Sync Methods
  function openEventListDialog(dayEvents: IEvent[]) {
    setDaysEvents(dayEvents);
    setShowListDialog(true);
    setShowCreateDialog(false);
    setShowEventDialog(false);
  }

  function openSelectedEvent(event: IEvent) {
    setSelectedEvent(event);
    setShowEventDialog(true);
    setShowCreateDialog(false);
    setShowListDialog(false);
  }

  function groupEventsByDate() {
    const eventsByDate: EventsByDate = {};

    if (events && events.length > 0) {
      events.forEach(event => {
        // Format the event's date as a string (e.g., "2024-03-05")
        const eventDate = new Date(event.date);
        const dateKey = DateUtils.formatDate(
          eventDate,
          'DD MMM YYYY',
          language,
        );

        // If the key doesn't exist in the accumulator, initialize it with an empty array
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }

        // Push the current event into the array for its date
        eventsByDate[dateKey].push(event);
      });
    }

    setLocalEvents(eventsByDate);
  }

  useEffect(() => {
    groupEventsByDate();
  }, [events]);

  function DayCellContent(day: number, dayEvents: IEvent[]) {
    const maxlimit = 15;

    return (
      <View style={styles.dayTextContainer}>
        <Text style={styles.dayText}>{day}</Text>
        {dayEvents.slice(0, 1).map((event, index) => (
          <TouchableOpacity
            key={`event-${day}-${event.name}-${index}`}
            onPress={() => openSelectedEvent(event)}
            style={styles.eventIndicator}>
            <Text style={styles.eventName}>
              {event.name.length > maxlimit
                ? event.name.substring(0, maxlimit - 3) + '...'
                : event.name}
            </Text>
          </TouchableOpacity>
        ))}
        {dayEvents.length > 1 && (
          <TouchableOpacity onPress={() => openEventListDialog(dayEvents)}>
            <Text style={styles.moreEventsText}>{t('calendar.more')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function DayCell(day: number, dayEvents: IEvent[]) {
    return (
      <View key={`DayCell-${day}`} style={styles.dayCell}>
        {DayCellContent(day, dayEvents)}
      </View>
    );
  }

  // TODO: Check scroll behavior
  return (
    <ScrollView style={styles.container}>
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setShowCreateDialog={setShowCreateDialog}
      />
      <View style={styles.daysOfWeekContainer}>
        {daysItems.map(day => (
          <Text key={day} style={styles.dayOfWeek}>
            {DateUtils.formatDay(day, i18n.language)}
          </Text>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {blankDays.map((_, index) => (
          <Text key={`start-blank-${index}`} style={styles.day}></Text>
        ))}
        {daysArray.map(day => {
          const dayDate = new Date(year, month, day);
          const dayKey = DateUtils.formatDate(dayDate);

          const dayEvents = localEvents[dayKey] || [];

          return DayCell(day, dayEvents);
        })}
        {endingBlanks.map((_, index) => (
          <Text key={`end-blank-${index}`} style={styles.day}></Text>
        ))}
      </View>
    </ScrollView>
  );
}

export default Calendar;
