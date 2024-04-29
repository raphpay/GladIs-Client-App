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

type SMQFabricationDevelopmentScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQFabricationDevelopmentScreen>;

function SMQFabricationDevelopmentScreen(props: SMQFabricationDevelopmentScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { currentSurvey } = useAppSelector((state: RootState) => state.appState);
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

  function isFormFilled() {
    let isFilled = false;
    isFilled = processusPilotName.length > 0 &&
      productionFlux.length > 0 &&
      productIdentifications.length > 0 &&
      productPreservation.length > 0 &&
      productTracking.length > 0;
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "21": processusPilotName,
        "22": productionFlux,
        "23": productIdentifications,
        "24": productPreservation,
        "25": productTracking
      }
    };

    // Retrieve existing client survey data
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
      navigation.navigate(NavigationRoutes.SMQClientRelationScreen);
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
    const fabricationDevelopment = surveyValue?.survey?.prs?.fabricationDevelopment;
    if (fabricationDevelopment) {
      setProcessusPilotName(fabricationDevelopment.processusPilotName);
      setProductionFlux(fabricationDevelopment.productionFlux);
      setProductIdentifications(fabricationDevelopment.productIdentifications);
      setProductPreservation(fabricationDevelopment.productPreservation);
      setProductTracking(fabricationDevelopment.productTracking);
    }
  }

  async function loadFromCache() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      const fabricationDevelopment = cachedSurvey?.survey?.prs?.fabricationDevelopment;
      if (fabricationDevelopment) {
        setProcessusPilotName(fabricationDevelopment.processusPilotName);
        setProductionFlux(fabricationDevelopment.productionFlux);
        setProductIdentifications(fabricationDevelopment.productIdentifications);
        setProductPreservation(fabricationDevelopment.productPreservation);
        setProductTracking(fabricationDevelopment.productTracking);
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
