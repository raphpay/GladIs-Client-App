import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import { IEvent } from '../../../business-logic/model/IEvent';
import UserType from '../../../business-logic/model/enums/UserType';
import EventService from '../../../business-logic/services/EventService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import Calendar from './Calendar';
import CreateEventDialog from './CreateEventDialog';
import EventDialog from './EventDialog';
import ListEventsDialog from './ListDialog';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  // Dialog
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showListDialog, setShowListDialog] = useState<boolean>(false);
  const [showEventDialog, setShowEventDialog] = useState<boolean>(false);
  // Date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysEvents, setDaysEvents] = useState<IEvent[]>([]);
  // Events
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);

  const { navigation } = props;

  const { t } = useTranslation();

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Async Methods
  async function loadEvents() {
    if (currentClient) {
      try {
        const events = await EventService.getInstance().getAllForClient(currentClient?.id as string, token);
        setEvents(events);
      } catch (error) {
        console.log("Error loading events", error);
      }
    } else {
      if (currentUser?.userType === UserType.Admin) {
        try {
          const events = await EventService.getInstance().getAll(token);
          setEvents(events);
        } catch (error) {
          console.log("Error loading events", error);
        }
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadEvents();
    }
    init();
  }, []);
  
  // Components
  function CreateEventDialogContent() {
    return (
      <CreateEventDialog
        showDialog={showCreateDialog}
        setShowDialog={setShowCreateDialog}
        events={events}
        setEvents={setEvents}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    )
  }

  function ListEventsDialogContent() {
    return (
      <ListEventsDialog
        showListDialog={showListDialog}
        setShowListDialog={setShowListDialog}
        daysEvents={daysEvents}
      />
    )
  }

  function EventDialogContent() {
    return (
      <EventDialog
        selectedEvent={selectedEvent as IEvent}
        showEventDialog={showEventDialog}
        setShowEventDialog={setShowEventDialog}
      />
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('modules.reminders')}
        showBackButton={true}
        showSearchText={false}
        showSettings={true}
        navigateBack={navigateBack}
        showDialog={showCreateDialog}
        setShowDialog={setShowCreateDialog}
      >
        <Calendar
          events={events}
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate}
          setSelectedDate={setSelectedDate}
          setShowCreateDialog={setShowCreateDialog}
          setShowListDialog={setShowListDialog}
          setShowEventDialog={setShowEventDialog}
          setSelectedEvent={setSelectedEvent}
          setDaysEvents={setDaysEvents}
        />
      </AppContainer>
      {CreateEventDialogContent()}
      {ListEventsDialogContent()}
      {EventDialogContent()}
    </>
  );
}

export default RemindersScreen;
