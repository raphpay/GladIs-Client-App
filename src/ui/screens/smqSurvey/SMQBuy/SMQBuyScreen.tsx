import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import IAction from '../../../../business-logic/model/IAction';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQBuyScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQBuyScreen>;

function SMQBuyScreen(props: SMQBuyScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { currentSurvey } = useAppSelector((state: RootState) => state.appState);
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

  function isFormFilled() {
    let isFilled = false;
    isFilled = processusPilotName.length > 0;
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "prs": {
          "buy": {
            processusPilotName,
          }
        }
      }
    };
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const buy = clientSurvey.survey.prs.buy;
    if (buy) {
      // Update management sub-section with new data
      existingClientSurvey.survey.prs.buy = buy;
      await saveClientSurvey(existingClientSurvey);
    } else {
      // No existing client survey data, save the new client survey data
      await saveClientSurvey(clientSurvey);
    }
  }

  async function saveClientSurvey(clientSurvey: any) {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
      await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, clientSurvey);
      navigation.navigate(NavigationRoutes.SMQResourcesManagementScreen);
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

  async function loadInfos() {
    if (currentSurvey) {
      loadFromCurrentSurvey();
    } else {
      await loadFromCache();
    }
  }

  async function loadFromCurrentSurvey() {
    const surveyValue = JSON.parse(currentSurvey.value);
    const processusPilotName = surveyValue?.survey?.prs?.buy.processusPilotName;
    if (processusPilotName) {
      setProcessusPilotName(processusPilotName);
    }
  }

  async function loadFromCache() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      const processusPilotName = cachedSurvey?.survey?.prs?.buy?.processusPilotName;
      if (processusPilotName) {
        setProcessusPilotName(processusPilotName);
      }
    } catch (error) {
      console.log('Error retrieving cached value', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init()
  }, []);

  // Components
  function ContinueButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.continue')}
          onPress={tappedContinue}
          disabled={!isFormFilled()}
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
