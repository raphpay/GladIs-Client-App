import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import SurveyPageCounter from '../../../components/SurveyPageCounter';

import SMQGeneralStepOne from './SMQGeneralStepOne';
import SMQGeneralStepThree from './SMQGeneralStepThree';
import SMQGeneralStepTwo from './SMQGeneralStepTwo';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQGeneralScreen>;

function SMQGeneralScreen(props: SMQGeneralScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  // States
  const [mainTitle, setMainTitle] = useState<string>('');
  const [stepNumber, setStepNumber] = useState<number>(1);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
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
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [hasUploadedFile, setHasUploadedFile] = useState<boolean>(false);
  const [selectedFilename, setSelectedFilename] = useState<string>('');
  const [fileID, setFileID] = useState<string>('');
  // Step Three
  const [website, setWebsite] = useState<string>('');
  const [auditorsName, setAuditorsName] = useState<string>('');
  const [auditorsFunction, setAuditorsFunction] = useState<string>('');
  const [approversName, setApproversName] = useState<string>('');
  const [approversFunction, setApproversFunction] = useState<string>('');

  // Actions
  function navigateBack() {
    setStepNumber(stepNumber - 1);
    if (stepNumber === 1) {
      SMQManager.getInstance().resetSurvey();
      navigation.goBack();
    }
  }

  // TODO: Continue implementation
  function updateMainTitle() {
    if (stepNumber === 1 || stepNumber === 2 || stepNumber === 3) {
      setMainTitle(t('smqSurvey.generalInfo.title'));
    }
  }

  async function tappedContinue() {
    switch (stepNumber) {
      case 1:
        await SMQManager.getInstance().continueAfterStepOne(
          companyName, companyHistory, managerName,
          medicalDevices, clients, area
        );
        setStepNumber(2);
        break;
      case 2:
        await SMQManager.getInstance().continueAfterStepTwo(
          activity, qualityGoals, hasOrganizationalChart,
          headquartersAddress, phoneNumber, email, fileID
        );
        setStepNumber(3);
        break;
      case 3:
        await SMQManager.getInstance().continueAfterStepThree(
          website, auditorsName, auditorsFunction,
          approversName, approversFunction
        );
        navigation.navigate(NavigationRoutes.SMQManagementScreen);
        break;
      default:
        break;
    }
  }

  // Load
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey && currentSurvey.value) {
      const surveyData = JSON.parse(currentSurvey.value);
      if (surveyData) {
        setCompanyName(surveyData['2']);
        setCompanyHistory(surveyData['3']);
        setManagerName(surveyData['4']);
        setMedicalDevices(surveyData['5']);
        setClients(surveyData['6']);
        setArea(surveyData['7']);
        setActivity(surveyData['8']);
        setQualityGoals(surveyData['9']);
        setHasOrganizationalChart(surveyData['10']);
        setHeadquartersAddress(surveyData['11']);
        setPhoneNumber(surveyData['12']);
        setEmail(surveyData['13']);
        setFileID(surveyData['organizationalChartID']);
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

  useEffect(() => {
    updateMainTitle();
  }, [stepNumber]);

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
    )
  }

  function print() {
    const test = SMQManager.getInstance().getClientID();
    console.log('tr', test );
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={stepNumber}/>
        {ContinueButton()}
        <TouchableOpacity onPress={print}>
          <Text>Print</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={mainTitle}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      additionalComponent={AdditionnalComponent()}
    >
      <>
        {
          stepNumber === 1 && (
            <SMQGeneralStepOne
              companyName={companyName} setCompanyName={setCompanyName}
              companyHistory={companyHistory} setCompanyHistory={setCompanyHistory}
              managerName={managerName} setManagerName={setManagerName}
              medicalDevices={medicalDevices} setMedicalDevices={setMedicalDevices}
              clients={clients} setClients={setClients}
              area={area} setArea={setArea}
            />
          )
        }
        {
          stepNumber === 2 && (
            <SMQGeneralStepTwo
              activity={activity} setActivity={setActivity}
              qualityGoals={qualityGoals} setQualityGoals={setQualityGoals}
              hasOrganizationalChart={hasOrganizationalChart} setHasOrganizationalChart={setHasOrganizationalChart}
              headquartersAddress={headquartersAddress} setHeadquartersAddress={setHeadquartersAddress}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
              email={email} setEmail={setEmail}
              setShowDialog={setShowDialog}
              hasUploadedFile={hasUploadedFile}
              selectedFilename={selectedFilename}
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
