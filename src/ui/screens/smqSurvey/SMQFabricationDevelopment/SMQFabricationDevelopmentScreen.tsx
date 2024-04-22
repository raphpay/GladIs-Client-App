import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { ISMQSurveyParams } from '../../../../navigation/Routes';
import AppContainer from '../../../components/AppContainer/AppContainer';

type SMQFabricationDevelopmentScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQFabricationDevelopmentScreen>;

function SMQFabricationDevelopmentScreen(props: SMQFabricationDevelopmentScreenProps): React.JSX.Element {

  const { navigation } = props;

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  async function tappedContinue() {
    console.log('tappedContinue');
  }

  return (
    <AppContainer
      mainTitle='Fabrication Development'
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
    >
      <>
      </>
    </AppContainer>
  );
}

export default SMQFabricationDevelopmentScreen;
