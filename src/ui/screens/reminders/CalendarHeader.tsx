import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';



import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';
import styles from '../../assets/styles/reminders/CalendarStyles';
import Dropdown from '../../components/Dropdown';

type CalendarHeaderProps = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setShowCreateDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function CalendarHeader(props: CalendarHeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  const { currentDate, setCurrentDate, setShowCreateDialog } = props;

  const [monthsOpen, setMonthsOpen] = useState(false);
  const [monthValue, setMonthValue] = useState(currentDate.getMonth());
  const [yearsOpen, setYearsOpen] = useState(false);
  const [yearValue, setYearValue] = useState(currentDate.getFullYear());
  const monthsItems = Array.from({ length: 12 }, (_, i) => i);
  const yearsItems = Array.from({ length: 20 }, (_, i) => i + 2015);

  const plusIcon = require('../../assets/images/plus-blue.png');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const formattedMonthYearDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

  const { currentClient } = useAppSelector((state: RootState) => state.users);

  const onMonthOpen = () => {
    setYearsOpen(false);
  };

  const onYearOpen = () => {
    setMonthsOpen(false);
  }

  // Sync Methods
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
    const today = new Date();
    setCurrentDate(today);
    setMonthValue(today.getMonth());
    setYearValue(today.getFullYear());
    closeDropdowns();
  }

  function closeDropdowns() {
    setMonthsOpen(false);
    setYearsOpen(false);
  }

  // Components
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
        <Dropdown
          open={monthsOpen}
          setOpen={setMonthsOpen}
          value={monthValue}
          setValue={setMonthValue}
          items={monthsItems.map(month => ({ label: Utils.formatMonth(month), value: month }))}
          onSelect={(month) => setCurrentDate(new Date(year, month.value as number, 1))}
          onOpen={onMonthOpen}
          containerWidth={100}
        />
        <Dropdown
          open={yearsOpen}
          setOpen={setYearsOpen}
          value={yearValue}
          setValue={setYearValue}
          items={yearsItems.map(year => ({ label: year.toString(), value: year }))}
          onSelect={(year) => setCurrentDate(new Date(year.value as number, month, 1))}
          onOpen={onYearOpen}
          containerWidth={100}
        />
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayText}>{t('calendar.today')}</Text>
        </TouchableOpacity>
        {ArrowButton('left')}
        {ArrowButton('right')}
        {
          currentClient && (
            <TouchableOpacity onPress={() => setShowCreateDialog(true)} style={styles.todayButton}>
              <Image source={plusIcon} style={styles.plusIcon}/>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
}

export default CalendarHeader;
