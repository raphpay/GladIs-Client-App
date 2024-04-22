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
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQManagementScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQManagementScreen>;

function SMQManagementScreen(props: SMQManagementScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);

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
        "prs": {
          "management": {
            processusPilotName
          }
        }
      }
    };
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    if (existingClientSurvey && typeof existingClientSurvey === 'object') {
      // Update management sub-section with new data
      existingClientSurvey.survey.prs.management = clientSurvey.survey.prs.management;
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
      navigation.navigate(NavigationRoutes.SMQMeasurementAndImprovement);
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

  async function loadInfos() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      if (cachedSurvey.survey.prs.management) {
        setProcessusPilotName(cachedSurvey.survey.prs.management.processusPilotName);
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
    )
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.management.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      additionalComponent={ContinueButton()}
      navigationHistoryItems={navigationHistoryItems}
    >
      <ScrollView>
        <GladisTextInput
          value={processusPilotName}
          onValueChange={setProcessusPilotName}
          placeholder={t('smqSurvey.prs.m01.processusPilotName')}
          showTitle={true}
        />
      </ScrollView>
    </AppContainer>
  );
}

export default SMQManagementScreen;
