import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import IAction from '../../../business-logic/model/IAction';
import { IEvent } from '../../../business-logic/model/IEvent';
import EventService from '../../../business-logic/services/EventService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import Toast from '../../components/Toast';

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
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient, currentUser, isAdmin } = useAppSelector((state: RootState) => state.users);

  const { navigation } = props;

  const { t } = useTranslation();

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function loadAllEvents() {
    const currentEvents = await loadEvents();
    const archivedEvents = await loadArchivedEvents();
    const allEvents = currentEvents.concat(archivedEvents);
    setEvents(allEvents);
  }

  async function loadEvents(): Promise<IEvent[]> {
    let events: IEvent[] = [];
    if (currentClient) {
      try {
        events = await EventService.getInstance().getAllForClient(currentClient?.id as string, token);
      } catch (error) {
        console.log("Error loading events", error);
      }
    } else {
      if (isAdmin) {
        try {
          events = await EventService.getInstance().getAll(token);
        } catch (error) {
          console.log("Error loading events", error);
        }
      }
    }
    return events;
  }

  async function loadArchivedEvents(): Promise<IEvent[]> {
    let archivedEvents: IEvent[] = [];
    if (currentClient) {
      try {
        archivedEvents = await EventService.getInstance().getArchivedForClient(currentClient?.id as string, token);
      } catch (error) {
        console.log("Error loading events", error);
      }
    } else {
      if (isAdmin) {
        try {
          archivedEvents = await EventService.getInstance().getArchivedEvents(token);
        } catch (error) {
          console.log("Error loading events", error);
        }
      }
    }
    return archivedEvents;
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadAllEvents();
    }
    init();
  }, []);
  
  // Components
  function CreateEventDialogContent() {
    return (
      <CreateEventDialog
        showDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
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
        setShowEventDialog={setShowEventDialog}
        setSelectedEvent={setSelectedEvent}
      />
    )
  }

  function EventDialogContent() {
    return (
      <>
        {
          showEventDialog && (
            <EventDialog
              selectedEvent={selectedEvent as IEvent}
              setShowEventDialog={setShowEventDialog}
              displayToast={displayToast}
              loadAllEvents={loadAllEvents}
            />
          )
        }
      </>
    )
  }

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
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
        navigationHistoryItems={navigationHistoryItems}
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
      {ToastContent()}
    </>
  );
}

export default RemindersScreen;
