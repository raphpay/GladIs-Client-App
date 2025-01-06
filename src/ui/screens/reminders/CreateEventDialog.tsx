import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { IEvent, IEventInput } from '../../../business-logic/model/IEvent';
import EventServicePost from '../../../business-logic/services/EventService/EventService.post';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import DateUtils from '../../../business-logic/utils/DateUtils';

import Dialog from '../../components/Dialogs/Dialog';
import Dropdown from '../../components/Dropdown';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

type CreateEventDialogProps = {
  showDialog: boolean;
  setShowCreateDialog: React.Dispatch<React.SetStateAction<boolean>>;
  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

// TODO: Clean code
function CreateEventDialog(props: CreateEventDialogProps): React.JSX.Element {
  const {
    showDialog,
    setShowCreateDialog,
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
  } = props;

  // Hooks
  const { t, i18n } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  // States
  const [eventName, setEventName] = useState<string>('');
  const [daysOpen, setDaysOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const monthsItems = Array.from({ length: 12 }, (_, i) => i);
  const yearsItems = Array.from({ length: 20 }, (_, i) => i + 2015);

  const [daysValue, setDaysValue] = useState(selectedDate.getDay());
  const [monthValue, setMonthValue] = useState(selectedDate.getMonth());
  const [yearValue, setYearValue] = useState(selectedDate.getFullYear());

  // Constants
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const [daysItems, setDaysItems] = useState(
    Array.from(
      { length: getDaysInMonth(monthValue, yearValue) },
      (_, i) => i + 1,
    ),
  );
  const language: 'en' | 'fr' = i18n.language === 'fr' ? 'fr' : 'en';

  // Sync Methods
  function resetDialog() {
    setEventName('');
    setShowCreateDialog(false);
  }

  const onDayOpen = () => {
    setMonthOpen(false);
    setYearOpen(false);
  };

  const onMonthOpen = () => {
    setDaysOpen(false);
    setYearOpen(false);
  };

  const onYearOpen = () => {
    setDaysOpen(false);
    setMonthOpen(false);
  };

  // Async Methods
  async function addEvent() {
    // Call API
    if (eventName !== '') {
      try {
        const selectedDateTimestamp = selectedDate.getTime();
        const event: IEventInput = {
          name: eventName,
          date: selectedDateTimestamp,
          clientID: currentClient?.id as string,
        };
        const newEvent = await EventServicePost.create(event, token);
        setEvents([...events, newEvent]);
        resetDialog();
      } catch (error) {
        console.log('Error adding event', error);
        // TODO: Display toast
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    setDaysItems(
      Array.from(
        { length: getDaysInMonth(monthValue, yearValue) },
        (_, i) => i + 1,
      ),
    );
  }, [monthValue, yearValue]);

  useEffect(() => {
    setSelectedDate(new Date(yearValue, monthValue, daysValue));
  }, []);

  useEffect(() => {
    setDaysValue(selectedDate.getDate());
    setMonthValue(selectedDate.getMonth());
    setYearValue(selectedDate.getFullYear());
  }, [selectedDate]);

  // Components
  function SelectedDatePickers() {
    return (
      <View style={{ zIndex: 1, flexDirection: 'row' }}>
        <Dropdown
          open={daysOpen}
          setOpen={setDaysOpen}
          value={daysValue}
          setValue={setDaysValue}
          items={daysItems.map(day => ({ label: day.toString(), value: day }))}
          onSelect={day =>
            setSelectedDate(
              new Date(yearValue, monthValue, day.value as number),
            )
          }
          onOpen={onDayOpen}
          containerWidth={100}
          containerHeight={60}
        />
        <Dropdown
          open={monthOpen}
          setOpen={setMonthOpen}
          value={monthValue}
          setValue={setMonthValue}
          items={monthsItems.map(month => ({
            label: DateUtils.formatMonth(month, i18n.language),
            value: month,
          }))}
          onSelect={month =>
            setSelectedDate(
              new Date(yearValue, month.value as number, daysValue),
            )
          }
          onOpen={onMonthOpen}
          containerWidth={150}
          containerHeight={60}
        />
        <Dropdown
          open={yearOpen}
          setOpen={setYearOpen}
          value={yearValue}
          setValue={setYearValue}
          items={yearsItems.map(year => ({
            label: year.toString(),
            value: year,
          }))}
          onSelect={year =>
            setSelectedDate(
              new Date(year.value as number, monthValue, daysValue),
            )
          }
          onOpen={onYearOpen}
          containerWidth={100}
          containerHeight={60}
        />
      </View>
    );
  }

  return (
    <>
      {showDialog && (
        <Dialog
          title={t('components.dialog.calendar.newEvent.title')}
          description={DateUtils.formatDate(
            selectedDate,
            'DD/MM/YYYY',
            language,
          )}
          isConfirmAvailable={true}
          confirmTitle={t('components.dialog.calendar.newEvent.confirm')}
          onConfirm={addEvent}
          isCancelAvailable={true}
          onCancel={resetDialog}
          descriptionChildren={SelectedDatePickers()}>
          <GladisTextInput
            value={eventName}
            onValueChange={setEventName}
            placeholder={t('components.dialog.calendar.newEvent.eventName')}
            autoCapitalize={'none'}
            width={'100%'}
          />
        </Dialog>
      )}
    </>
  );
}

export default CreateEventDialog;
