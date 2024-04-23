import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import IAction from '../../../../business-logic/model/IAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { ISMQSurveyParams } from '../../../../navigation/Routes';
import AppContainer from '../../../components/AppContainer/AppContainer';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

type SMQFabricationDevelopmentScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQFabricationDevelopmentScreen>;

function SMQFabricationDevelopmentScreen(props: SMQFabricationDevelopmentScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');
  const [productionFlux, setProductionFlux] = React.useState<string>('');
  const [productIdentifications, setProductIdentifications] = React.useState<string>('');
  const [productPreservation, setProductPreservation] = React.useState<string>('');
  const [productTracking, setProductTracking] = React.useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.measurement.title'),
      onPress: () => navigateBack(),
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Components
  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.fabricationDevelopment.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      navigationHistoryItems={navigationHistoryItems}
    >
      <ScrollView>
        <GladisTextInput
          value={processusPilotName}
          onValueChange={setProcessusPilotName}
          placeholder={t('smqSurvey.prs.management.processusPilotName')}
          showTitle={true}
        />
        <GladisTextInput
          value={productionFlux}
          onValueChange={setProductionFlux}
          placeholder={t('smqSurvey.prs.fabricationDevelopment.productionFlux')}
          showTitle={true}
        />
        <GladisTextInput
          value={productIdentifications}
          onValueChange={setProductIdentifications}
          placeholder={t('smqSurvey.prs.fabricationDevelopment.productIdentifications')}
          showTitle={true}
        />
        <GladisTextInput
          value={productPreservation}
          onValueChange={setProductPreservation}
          placeholder={t('smqSurvey.prs.fabricationDevelopment.productPreservation')}
          showTitle={true}
        />
        <GladisTextInput
          value={productTracking}
          onValueChange={setProductTracking}
          placeholder={t('smqSurvey.prs.fabricationDevelopment.productTracking')}
          showTitle={true}
        />
      </ScrollView>
    </AppContainer>
  );
}

export default SMQFabricationDevelopmentScreen;
