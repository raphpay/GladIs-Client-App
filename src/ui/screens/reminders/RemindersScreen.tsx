import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import Utils from '../../../business-logic/utils/Utils';

import EventService from '../../../business-logic/services/EventService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import { IEvent } from '../../../business-logic/model/IEvent';
import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import Calendar from './Calendar';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventName, setEventName] = useState<string>('');
  const [events, setEvents] = useState<IEvent[]>([]);

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
        console.log('reminder', events );
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

  function DialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.calendar.newEvent.title')}
              description={Utils.formatStringDate(currentDate)}
              isConfirmAvailable={true}
              confirmTitle={t('components.dialog.calendar.newEvent.confirm')}
              onConfirm={() => setShowDialog(false)}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
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
    )
  }
  
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
          setShowDialog={setShowDialog}
        />
      </AppContainer>
      {DialogContent()}
    </>
  );
}

export default RemindersScreen;
