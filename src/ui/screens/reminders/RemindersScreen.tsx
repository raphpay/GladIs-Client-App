import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { IRootStackParams } from '../../../navigation/Routes';
import AppContainer from '../../components/AppContainer';
import Calendar from './Calendar';

type RemindersScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RemindersScreen>;

function RemindersScreen(props: RemindersScreenProps): React.JSX.Element {

  const { navigation } = props;

  function navigateBack() {
    navigation.goBack();
  }
  
  return (
    <AppContainer
      mainTitle='Reminders'
      showBackButton={true}
      showSearchText={false}
      showSettings={true}
      navigateBack={navigateBack}
    >
      <Calendar /> 
    </AppContainer>
  );
}

export default RemindersScreen;