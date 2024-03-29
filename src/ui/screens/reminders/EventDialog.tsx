import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { IEvent, IEventInput } from '../../../business-logic/model/IEvent';
import EventService from '../../../business-logic/services/EventService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import GladisTextInput from '../../components/GladisTextInput';

type EventDialogProps = {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

function EventDialog(props: EventDialogProps): React.JSX.Element {

  const {
    showDialog, setShowDialog,
    selectedDate, setSelectedDate,
    events, setEvents
  } = props;

  const [eventName, setEventName] = useState<string>('');
  const [daysOpen, setDaysOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const monthsItems = Array.from({ length: 12 }, (_, i) => i);
  const yearsItems = Array.from({ length: 20 }, (_, i) => i + 2015);

  const day = selectedDate.getDay();
  const [daysValue, setDaysValue] = useState(day);
  const month = selectedDate.getMonth();
  const [monthValue, setMonthValue] = useState(month);
  const year = selectedDate.getFullYear();
  const [yearValue, setYearValue] = useState(year);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const [daysItems, setDaysItems] = useState(Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1));

  const { t } = useTranslation();

  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  async function addEvent() {
    // Call API
    if (eventName !== '') {
      try {
        const selectedDateTimestamp = selectedDate.getTime();
        const event: IEventInput = {
          name: eventName,
          date: selectedDateTimestamp,
          clientID: currentClient?.id as string
        }
        const newEvent = await EventService.getInstance().create(event, token);
        setEvents([...events, newEvent]);
        resetDialog();
      } catch (error) {
        console.log('Error adding event', error );
        // Show alert
      }
    }
  }

  function resetDialog() {
    setEventName('');
    setShowDialog(false);
  }

  const onDayOpen = () => {
    setMonthOpen(false);
    setYearOpen(false);
  };

  const onMonthOpen = () => {
    setDaysOpen(false);
    setYearOpen(false);
  }

  const onYearOpen = () => {
    setDaysOpen(false);
    setMonthOpen(false);
  }

  useEffect(() => {
    setDaysItems(Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1));
  }, [month, year]);

  function SelectedDatePickers() {
    return (
      <View style={{zIndex: 1, flexDirection: 'row'}}>
        <Dropdown
          open={daysOpen}
          setOpen={setDaysOpen}
          value={daysValue}
          setValue={setDaysValue}
          items={daysItems.map(day => ({ label: day.toString(), value: day }))}
          onSelect={(day) => setSelectedDate(new Date(year, month, day.value as number))}
          onOpen={onDayOpen}
          containerWidth={100}
          containerHeight={60}
        />
        <Dropdown
          open={monthOpen}
          setOpen={setMonthOpen}
          value={monthValue}
          setValue={setMonthValue}
          items={monthsItems.map(month => ({ label: Utils.formatMonth(month), value: month }))}
          onSelect={(month) => setSelectedDate(new Date(year, month.value as number, 1))}
          onOpen={onMonthOpen}
          containerWidth={150}
          containerHeight={60}
        />
        <Dropdown
          open={yearOpen}
          setOpen={setYearOpen}
          value={yearValue}
          setValue={setYearValue}
          items={yearsItems.map(year => ({ label: year.toString(), value: year }))}
          onSelect={(year) => setSelectedDate(new Date(year.value as number, month, 1))}
          onOpen={onYearOpen}
          containerWidth={100}
          containerHeight={60}
        />
      </View>
    );
  }

  return (
    <>
      {
        showDialog && (
          <Dialog
            title={t('components.dialog.calendar.newEvent.title')}
            description={Utils.formatStringDate(selectedDate)}
            isConfirmAvailable={true}
            confirmTitle={t('components.dialog.calendar.newEvent.confirm')}
            onConfirm={addEvent}
            isCancelAvailable={true}
            onCancel={resetDialog}
            descriptionChildren={(SelectedDatePickers())}
          >
            <GladisTextInput
              value={eventName}
              onValueChange={setEventName}
              placeholder={t('components.dialog.calendar.newEvent.eventName')}
              autoCapitalize={'none'}
              width={'100%'}
            />
          </Dialog>
        )
      }
    </>
  );
}

export default EventDialog;
