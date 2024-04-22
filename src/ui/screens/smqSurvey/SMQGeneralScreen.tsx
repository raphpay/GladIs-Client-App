import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { ISMQSurveyParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';

import SMQGeneralStepOne from './SMQGeneralStepOne';
import SMQGeneralStepTwo from './SMQGeneralStepTwo';

import styles from '../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQGeneralScreen>;

function SMQGeneralScreen(props: SMQGeneralScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  // States
  const [stepNumber, setStepNumber] = useState<number>(1);
  // Questions
  // Step One
  const [companyName, setCompanyName] = useState<string>('');
  const [companyHistory, setCompanyHistory] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [medicalDevices, setMedicalDevices] = useState<string>('');
  const [clients, setClients] = useState<string>('');
  const [area, setArea] = useState<string>('');
  // Step Two
  const [activity, setActivity] = useState<string>('');
  const [qualityGoals, setQualityGoals] = useState<string>('');
  const [hasOrganizationalChart, setHasOrganizationalChart] = useState<boolean>(false);
  const [headquartersAddress, setHeadquartersAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Sync Methods
  function navigateBack() {
    switch (stepNumber) {
      case 1:
        navigation.goBack();
        break;
      case 2:
        setStepNumber(stepNumber - 1);
        break;
      case 3:
        setStepNumber(stepNumber - 1);
        break;
    }
  }

  function loadInfos() {
    if (currentClient) {
      setCompanyName(currentClient.companyName);
    }
  }

  function isFormFilled() {
    let isFilled = false;
    switch (stepNumber) {
      case 1:
        isFilled = companyName.length > 0 &&
        companyHistory.length > 0 &&
        managerName.length > 0 &&
        medicalDevices.length > 0 &&
        clients.length > 0 &&
        area.length > 0;
        break;
      case 2:
        isFilled = activity.length > 0 &&
        qualityGoals.length > 0 &&
        headquartersAddress.length > 0 &&
        phoneNumber.length > 0 &&
        email.length > 0;
        break;
      case 3:
        isFilled = true;
        break;
    }

    
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    switch (stepNumber) {
      case 1:
        await continueGeneralProcessStepOne();
        break;
      case 2:
        await continueGeneralProcessStepTwo();
        break;
      case 3:
        await continueGeneralProcessStepThree();
        break;
    }
  }

  async function continueGeneralProcessStepOne() {
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "generalSection": {
          companyName,
          companyHistory,
          managerName,
          medicalDevices,
          clients,
          area
        }
      }
    };
    
    await saveClientSurvey(clientSurvey);
  }

  async function continueGeneralProcessStepTwo() {
    let clientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const stepTwoData = {
      activity,
      qualityGoals,
      hasOrganizationalChart,
      headquartersAddress,
      phoneNumber,
      email,
    };

    // Complete the current survey with the data from the second step
    if (clientSurvey && typeof clientSurvey === 'object') {
      clientSurvey.survey.generalSection = {
        ...clientSurvey.survey.generalSection,
        ...stepTwoData
      };
    }

    await saveClientSurvey(clientSurvey);
  }

  async function continueGeneralProcessStepThree() {}

  async function saveClientSurvey(clientSurvey: any) {
    try {
      await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, clientSurvey);
      setStepNumber(stepNumber + 1);
    } catch (error) {
      console.log('Error caching client survey', error);
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
          disabled={!isFormFilled()}
        />
      </View>
    )
  }

  return (
    <AppContainer
      mainTitle={t('smqSurvey.generalInfo.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      additionalComponent={ContinueButton()}
    >
      <>
        {stepNumber === 1 && (
          <SMQGeneralStepOne
            companyName={companyName} setCompanyName={setCompanyName}
            companyHistory={companyHistory} setCompanyHistory={setCompanyHistory}
            managerName={managerName} setManagerName={setManagerName}
            medicalDevices={medicalDevices} setMedicalDevices={setMedicalDevices}
            clients={clients} setClients={setClients}
            area={area} setArea={setArea}
          />
        )}
        {
          stepNumber === 2 && (
            <SMQGeneralStepTwo
              activity={activity} setActivity={setActivity}
              qualityGoals={qualityGoals} setQualityGoals={setQualityGoals}
              hasOrganizationalChart={hasOrganizationalChart} setHasOrganizationalChart={setHasOrganizationalChart}
              headquartersAddress={headquartersAddress} setHeadquartersAddress={setHeadquartersAddress}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
              email={email} setEmail={setEmail}
            />
          )
        }
      </>
    </AppContainer>
  );
}

export default SMQGeneralScreen;
