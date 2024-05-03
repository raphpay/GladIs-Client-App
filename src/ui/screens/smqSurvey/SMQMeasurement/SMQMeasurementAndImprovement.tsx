import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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

type SMQMeasurementAndImprovementProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQMeasurementAndImprovement>;

function SMQMeasurementAndImprovement(props: SMQMeasurementAndImprovementProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  // States
  const [processusPilotName, setProcessusPilotName] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.management.title'),
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Async Methods
  async function tappedContinue() {
    await SMQManager.getInstance().continueAfterMeasurementAndImprovementScreen(processusPilotName);
    navigation.navigate(NavigationRoutes.SMQFabricationDevelopmentScreen);
  }

  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setProcessusPilotName(surveyData['20']);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    loadInfos();
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
        <SurveyPageCounter page={5}/>
        {ContinueButton()}
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.measurement.title')}
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
      </ScrollView>
    </AppContainer>
  );
}

export default SMQMeasurementAndImprovement;
