import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import Utils from '../../../business-logic/utils/Utils';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import Calendar from './Calendar';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventName, setEventName] = useState<string>('');

  const { navigation } = props;

  const { t } = useTranslation();

  function navigateBack() {
    navigation.goBack();
  }

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
