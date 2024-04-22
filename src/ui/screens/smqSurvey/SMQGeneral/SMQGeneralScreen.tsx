import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';

import SMQGeneralStepOne from './SMQGeneralStepOne';
import SMQGeneralStepThree from './SMQGeneralStepThree';
import SMQGeneralStepTwo from './SMQGeneralStepTwo';

import IAction from '../../../../business-logic/model/IAction';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQGeneralScreen>;

function SMQGeneralScreen(props: SMQGeneralScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { smqScreenSource } = useAppSelector((state: RootState) => state.appState);
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
  // Step Three
  const [website, setWebsite] = useState<string>('');
  const [auditorsName, setAuditorsName] = useState<string>('');
  const [auditorsFunction, setAuditorsFunction] = useState<string>('');
  const [approversName, setApproversName] = useState<string>('');
  const [approversFunction, setApproversFunction] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: smqScreenSource,
      onPress: () => navigateBack()
    }
  ];

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
      default:
        navigation.goBack();
        break;
    }
  }

  function isFormFilled() {
    let isFilled = false;
    switch (stepNumber) {
      case 1:
        if (companyName && companyHistory && managerName && medicalDevices && clients && area) {
          isFilled = companyName.length > 0 &&
          companyHistory.length > 0 &&
          managerName.length > 0 &&
          medicalDevices.length > 0 &&
          clients.length > 0 &&
          area.length > 0;
        }
        break;
      case 2:
        if (activity && qualityGoals && headquartersAddress && phoneNumber && email) {
          isFilled = activity.length > 0 &&
          qualityGoals.length > 0 &&
          headquartersAddress.length > 0 &&
          phoneNumber.length > 0 &&
          email.length > 0;
        }
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
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    if (existingClientSurvey && typeof existingClientSurvey === 'object') {
      // Update only the fields that are different from stepOneData
      const updatedGeneralSection = { ...existingClientSurvey.survey.generalSection };
  
      for (const key in clientSurvey.survey.generalSection) {
        if (clientSurvey.survey.generalSection.hasOwnProperty(key) && clientSurvey.survey.generalSection[key] !== updatedGeneralSection[key]) {
          updatedGeneralSection[key] = clientSurvey.survey.generalSection[key];
        }
      }
  
      // Update existing client survey data
      existingClientSurvey.survey.generalSection = updatedGeneralSection;
      await saveClientSurvey(existingClientSurvey);
    } else {
      // No existing client survey data, save the new client survey data
      await saveClientSurvey(clientSurvey);
    }
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
  
    // Update only the fields that are different from stepTwoData
    if (clientSurvey && typeof clientSurvey === 'object') {
      const updatedGeneralSection = { ...clientSurvey.survey.generalSection };
  
      for (const key in stepTwoData) {
        if (stepTwoData.hasOwnProperty(key) && stepTwoData[key] !== updatedGeneralSection[key]) {
          updatedGeneralSection[key] = stepTwoData[key];
        }
      }
  
      clientSurvey.survey.generalSection = updatedGeneralSection;
    }
  
    await saveClientSurvey(clientSurvey);
  }

  async function continueGeneralProcessStepThree() {
    let clientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const stepThreeData = {
      website,
      auditorsName,
      auditorsFunction,
      approversName,
      approversFunction,
    };

    // Update only the fields that are different from stepThreeData
    if (clientSurvey && typeof clientSurvey === 'object') {
      const updatedGeneralSection = { ...clientSurvey.survey.generalSection };

      for (const key in stepThreeData) {
        if (stepThreeData.hasOwnProperty(key) && stepThreeData[key] !== updatedGeneralSection[key]) {
          updatedGeneralSection[key] = stepThreeData[key];
        }
      }

      clientSurvey.survey.generalSection = updatedGeneralSection;
    }

    await saveClientSurvey(clientSurvey);
  }

  async function saveClientSurvey(clientSurvey: any) {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
      await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, clientSurvey);
      if (stepNumber === 3) {
        navigation.navigate(NavigationRoutes.SMQManagementScreen);
      } else {
        setStepNumber(stepNumber + 1);
      }
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

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
      navigationHistoryItems={navigationHistoryItems}
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
              setHasOrganizationalChart={setHasOrganizationalChart}
              headquartersAddress={headquartersAddress} setHeadquartersAddress={setHeadquartersAddress}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
              email={email} setEmail={setEmail}
            />
          )
        }
        {
          stepNumber === 3 && (
            <SMQGeneralStepThree
              website={website} setWebsite={setWebsite}
              auditorsName={auditorsName} setAuditorsName={setAuditorsName}
              auditorsFunction={auditorsFunction} setAuditorsFunction={setAuditorsFunction}
              approversName={approversName} setApproversName={setApproversName}
              approversFunction={approversFunction} setApproversFunction={setApproversFunction}
            />
          )
        }
      </>
    </AppContainer>
  );
}

export default SMQGeneralScreen;
