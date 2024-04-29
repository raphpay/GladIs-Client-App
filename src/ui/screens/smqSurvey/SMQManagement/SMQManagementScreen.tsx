import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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

type SMQManagementScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQManagementScreen>;

function SMQManagementScreen(props: SMQManagementScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { currentSurvey } = useAppSelector((state: RootState) => state.appState);

  // States
  const [processusPilotName, setProcessusPilotName] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.generalInfo.title'),
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    if (processusPilotName.length > 0) {
      isFilled = true;
    }
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "19": processusPilotName
      }
    };

    let cachedSurvey: any;

    try {
      cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    } catch (error) {
      console.log('Error retrieving cached survey', error);
    }


    if (cachedSurvey.survey) {
      const concatenetedJSON = Object.assign(cachedSurvey.survey, clientSurvey.survey);
      const survey = {
        "currentClientID": currentClient?.id,
        "survey": concatenetedJSON,
      };
      await saveClientSurvey(survey);
    } else {
      await saveClientSurvey(clientSurvey);
    }
  }

  async function saveClientSurvey(clientSurvey: any) {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
      await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, clientSurvey);
      await CacheService.getInstance().storeValue(CacheKeys.isSMQFormFilled, isFormFilled());
      navigation.navigate(NavigationRoutes.SMQMeasurementAndImprovement);
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
    const processusPilotName = surveyValue?.survey?.prs?.management?.processusPilotName;
    if (processusPilotName) {
      setProcessusPilotName(processusPilotName);
    }
  }

  async function loadFromCache() {
    let cachedSurvey: any;
    try {
      cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    } catch (error) {
      console.log('Error retrieving cached value', error);
    }

    const processusPilotName = cachedSurvey?.survey?.prs?.management?.processusPilotName;
    if (processusPilotName) {
      setProcessusPilotName(processusPilotName);
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
        />
      </View>
    );
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={4}/>
        {ContinueButton()}
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.management.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      additionalComponent={AdditionnalComponent()}
      navigationHistoryItems={navigationHistoryItems}
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

export default SMQManagementScreen;
