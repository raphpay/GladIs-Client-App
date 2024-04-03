import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import { IEvent } from '../../../business-logic/model/IEvent';
import EventService from '../../../business-logic/services/EventService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import Calendar from './Calendar';
import EventDialog from './EventDialog';
import ListEventsDialog from './ListDialog';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showListDialog, setShowListDialog] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const [daysEvents, setDaysEvents] = useState<IEvent[]>([]);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);

  const { navigation } = props;

  const { t } = useTranslation();

  function navigateBack() {
    navigation.goBack();
  }

  async function loadEvents() {
    try {
      if (currentClient?.id) {
        const events = await EventService.getInstance().getAllForClient(currentClient.id as string, token);
        setEvents(events);
      }
    } catch (error) {
      // Show alert
    }
  }

  useEffect(() => {
    async function init() {
      await loadEvents();
    }
    init();
  }, []);
  
  // TODO: Add translations
  return (
    <>
      <AppContainer
        mainTitle='Reminders'
        showBackButton={true}
        showSearchText={false}
        showSettings={true}
        navigateBack={navigateBack}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      >
        <Calendar
          events={events}
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate}
          setSelectedDate={setSelectedDate}
          setShowDialog={setShowDialog}
          setShowListDialog={setShowListDialog}
          setDaysEvents={setDaysEvents}
        />
      </AppContainer>
      {
        <EventDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          events={events}
          setEvents={setEvents}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      }
      {
        <ListEventsDialog
          showListDialog={showListDialog}
          setShowListDialog={setShowListDialog}
          daysEvents={daysEvents}
        />
      }
    </>
  );
}

export default RemindersScreen;
