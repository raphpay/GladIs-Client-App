import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import IAction from '../../../../business-logic/model/IAction';
import { ISurveyInput } from '../../../../business-logic/model/ISurvey';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../../business-logic/services/CacheService';
import SurveyService from '../../../../business-logic/services/SurveyService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';


type SMQRegulatoryAffairsProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQRegulatoryAffairs>;

function SMQRegulatoryAffairs(props: SMQRegulatoryAffairsProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { smqScreenSource } = useAppSelector((state: RootState) => state.appState);
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');
  const [safeguardMeasures, setSafeguardMeasures] = React.useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.resourcesManagement.title'),
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
          "regulatoryAffairs": {
            processusPilotName,
            safeguardMeasures
          }
        }
      }
    };
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const regulatoryAffairs = clientSurvey.survey.prs.regulatoryAffairs;
    if (regulatoryAffairs) {
      // Update management sub-section with new data
      existingClientSurvey.survey.prs.regulatoryAffairs = regulatoryAffairs;
      try {
        const clientID = currentClient?.id as string;
        const apiSurvey: ISurveyInput = {
          value: JSON.stringify(existingClientSurvey),
          clientID
        };
        await SurveyService.getInstance().createSurvey(apiSurvey, null);
        // await removeCachedSurvey();
        navigation.navigate(NavigationRoutes.SystemQualityScreen);
      } catch (error) {
        console.log('Error saving survey', error);
      }
    }
  }

  async function removeCachedSurvey() {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
      navigation.navigate(NavigationRoutes.SystemQualityScreen);
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

  async function loadInfos() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      const regulatoryAffairs = cachedSurvey?.survey?.prs?.regulatoryAffairs;
      if (regulatoryAffairs) {
        setProcessusPilotName(regulatoryAffairs.processusPilotName);
        setSafeguardMeasures(regulatoryAffairs.safeguardMeasures);
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
  function FinishButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.finish')}
          onPress={tappedContinue}
          disabled={!isFormFilled()}
        />
      </View>
    );
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={10}/>
        {FinishButton()}
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.regulatoryAffairs.title')}
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
          value={safeguardMeasures}
          onValueChange={setSafeguardMeasures}
          placeholder={t('smqSurvey.prs.regulatoryAffairs.safeguardMeasures')}
          showTitle={true}
        />
      </ScrollView>
    </AppContainer>
  );
}

export default SMQRegulatoryAffairs;
