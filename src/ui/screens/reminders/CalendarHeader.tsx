import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import Utils from '../../../business-logic/utils/Utils';

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

  const plusIcon = require('../../assets/images/plus.png');

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
    const nextMonth = new Date(year, month + 1, 1);
    setCurrentDate(nextMonth);
    setMonthValue(nextMonth.getMonth());
    setYearValue(nextMonth.getFullYear());
    closeDropdowns();
  }

  function goToPreviousMonth() {
    const previousMonth = new Date(year, month - 1, 1);
    setCurrentDate(previousMonth);
    setMonthValue(previousMonth.getMonth());
    setYearValue(previousMonth.getFullYear());
    closeDropdowns();
  }

  function goToToday() {
    setCurrentDate(new Date());
    setMonthValue(currentDate.getMonth());
    setYearValue(currentDate.getFullYear());
    closeDropdowns();
  }

  function closeDropdowns() {
    setMonthsOpen(false);
    setYearsOpen(false);
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

  // TODO: Add a new plus icon with a primary color
  // TODO: Add action on plus
  return (
    <View style={styles.header}>
      <Text style={styles.monthYearText}>{formattedMonthYearDate}</Text>
      <View style={styles.headerButtons}>
        <DropDownPicker
          open={monthsOpen}
          value={monthValue}
          items={monthsItems.map(month => ({ label: Utils.formatMonth(currentDate), value: month }))}
          setOpen={setMonthsOpen}
          onOpen={onMonthOpen}
          setValue={setMonthValue}
          setItems={setMonthsItems}
          onSelectItem={(month) => setCurrentDate(new Date(year, month.value as number, 1))}
          containerStyle={{...styles.containerStyle, width: 150}}
          dropDownDirection='BOTTOM'
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
          dropDownDirection='BOTTOM'
          containerStyle={{...styles.containerStyle, width: 100}}
          style={styles.dropdownStyle}
          textStyle={styles.dropdownText}
        />
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.dropdownText}>{t('calendar.today')}</Text>
        </TouchableOpacity>
        {ArrowButton('left')}
        {ArrowButton('right')}
        <TouchableOpacity style={styles.todayButton}>
          <Image source={plusIcon} style={styles.plusIcon}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CalendarHeader;
