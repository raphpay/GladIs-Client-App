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

type SMQBuyScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQBuyScreen>;

function SMQBuyScreen(props: SMQBuyScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.fabricationDevelopment.title'),
      onPress: () => navigateBack(),
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Async Methods
  async function tappedContinue() {
    await SMQManager.getInstance().continueAfterBuyScreen(processusPilotName);
    navigation.navigate(NavigationRoutes.SMQResourcesManagementScreen);
  }

  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setProcessusPilotName(surveyData['29']);
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
        <SurveyPageCounter page={8}/>
        {ContinueButton()}
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.buy.title')}
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

export default SMQBuyScreen;
