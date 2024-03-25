import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import styles from '../../assets/styles/reminders/CalendarStyles';

type CalendarHeaderProps = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

function CalendarHeader(props: CalendarHeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  const { currentDate, setCurrentDate } = props;

  const [monthsOpen, setMonthsOpen] = useState(false);
  const [monthValue, setMonthValue] = useState(currentDate.getMonth());
  const [yearsOpen, setYearsOpen] = useState(false);
  const [yearValue, setYearValue] = useState(currentDate.getFullYear());
  const [monthsItems, setMonthsItems] = useState(Array.from({ length: 12 }, (_, i) => i));
  const [yearsItems, setYearsItems] = useState(Array.from({ length: 20 }, (_, i) => i + 2015));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const formattedMonthYearDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

  const onMonthOpen = () => {
    setYearsOpen(false);
  };

  const onYearOpen = () => {
    setMonthsOpen(false);
  }

  function goToNextMonth() {
    // TODO: Implement state for month and year
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

  const formatMonth = (month: number) => {
    return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(year, month));
  };

  function ArrowButton(side: 'left' | 'right') {
    return (
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={side === 'left' ? goToPreviousMonth : goToNextMonth}>
          <Text>{side === 'left' ? '<' : '>'}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.header}>
      <Text style={styles.monthYearText}>{formattedMonthYearDate}</Text>
      <View style={styles.headerButtons}>
        <DropDownPicker
          open={monthsOpen}
          value={monthValue}
          items={monthsItems.map(month => ({ label: formatMonth(month), value: month }))}
          setOpen={setMonthsOpen}
          onOpen={onMonthOpen}
          setValue={setMonthValue}
          setItems={setMonthsItems}
          onSelectItem={(month) => setCurrentDate(new Date(year, month.value as number, 1))}
          containerStyle={{...styles.containerStyle, width: 150}}
          style={styles.dropdownStyle}
          textStyle={styles.dropdownText}
        />
        <DropDownPicker
          open={yearsOpen}
          value={yearValue}
          items={yearsItems.map(year => ({ label: year.toString(), value: year }))}
          setOpen={setYearsOpen}
          onOpen={onYearOpen}
          setValue={setYearValue}
          setItems={setYearsItems}
          onSelectItem={(year) => setCurrentDate(new Date(year.value as number, month, 1))}
          containerStyle={{...styles.containerStyle, width: 100}}
          style={styles.dropdownStyle}
          textStyle={styles.dropdownText}
        />
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.dropdownText}>{t('calendar.today')}</Text>
        </TouchableOpacity>
        {ArrowButton('left')}
        {ArrowButton('right')}
      </View>
    </View>
  );
}

export default CalendarHeader;
