import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import IAction from '../../../../business-logic/model/IAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

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

  // Async Methods
  async function tappedContinue() {
    await SMQManager.getInstance().continueAfterFabricationDevelopmentScreen(
      processusPilotName, productionFlux,
      productIdentifications, productPreservation,
      productTracking);
    navigation.navigate(NavigationRoutes.SMQClientRelationScreen);
  }

  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setProcessusPilotName(surveyData['21']);
        setProductionFlux(surveyData['22']);
        setProductIdentifications(surveyData['23']);
        setProductPreservation(surveyData['24']);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init();
  }, []);

  // Components
  function ContinueButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.continue')}
          onPress={tappedContinue}
        />
      </View>
    );
  }
  
  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={6}/>
        {ContinueButton()}
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.fabricationDevelopment.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      navigationHistoryItems={navigationHistoryItems}
      additionalComponent={AdditionnalComponent()}
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
