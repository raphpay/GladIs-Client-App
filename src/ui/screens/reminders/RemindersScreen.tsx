import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import Utils from '../../../business-logic/utils/Utils';
import { IRootStackParams } from '../../../navigation/Routes';
import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import Calendar from './Calendar';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { navigation } = props;

  function navigateBack() {
    navigation.goBack();
  }

  function DialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={`${Utils.formatMonth(currentDate)}`}
              description='Dialog Description'
              onConfirm={() => setShowDialog(false)}
              onCancel={() => setShowDialog(false)}
            />
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