import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import IAction from '../../../../business-logic/model/IAction';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IFile from '../../../../business-logic/model/IFile';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import PlatformName from '../../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../../business-logic/modules/FinderModule';
import CacheService from '../../../../business-logic/services/CacheService';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentService from '../../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';

import SurveyPageCounter from '../../../components/SurveyPageCounter';
import SMQGeneralStepOne from './SMQGeneralStepOne';
import SMQGeneralStepThree from './SMQGeneralStepThree';
import SMQGeneralStepTwo from './SMQGeneralStepTwo';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQGeneralScreen>;

function SMQGeneralScreen(props: SMQGeneralScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient, currentUser} = useAppSelector((state: RootState) => state.users);
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
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: smqScreenSource,
      onPress: () => navigateBack()
    }
  ];

  const popoverActions: IAction[] = [
    {
      title: t('smqSurvey.generalInfo.stepTwo.selectPngFile'),
      onPress: () => selectPNGFile(),
    },
    {
      title: t('smqSurvey.generalInfo.stepTwo.selectPdfFile'),
      onPress: () => selectPDFFile(),
    },
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
        if (website && auditorsName && auditorsFunction && approversName && approversFunction) {
          isFilled = website.length > 0 &&
          auditorsName.length > 0 &&
          auditorsFunction.length > 0 &&
          approversName.length > 0 &&
          approversFunction.length > 0;
        }
        break;
    }
    return isFilled;
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
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
      organizationalChartID: fileID
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

  async function selectPNGFile() {
    let data: string = '';
    if (Platform.OS === PlatformName.Mac) {
      data = await FinderModule.getInstance().pickImage();
    } else {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.images });
      data = await Utils.getFileBase64FromURI(doc.uri) as string;
    }
    if (data) {
      const fileName = 'organizationalChart.png';
      setSelectedFilename(fileName);
      const file: IFile = {
        data,
        filename: fileName
      }
      try {
        const path = `${currentClient?.companyName ?? "noCompany"}/smqSurvey/`;
        const uploadedLogo = await DocumentService.getInstance().uploadLogo(file, fileName, path);
        setHasUploadedFile(true);
        setShowDialog(false);
        setFileID(uploadedLogo.id);
        displayToast(t('smqSurvey.generalInfo.stepTwo.uploadSuccess'));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(errorMessage, true);
      }
    }
  }

  async function selectPDFFile() {
    const filename = 'organizationalChart.pdf';
    setSelectedFilename(filename);
    const path = `${currentClient?.companyName ?? "noCompany"}/smqSurvey/`;
    let data: string = '';
    if (Platform.OS !== PlatformName.Mac) {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
      data = await Utils.getFileBase64FromURI(doc.uri) as string;
    } else {
      data = await FinderModule.getInstance().pickPDF();
    }
    try {
      const file: IFile = { data, filename: filename}
      const createdDocument = await DocumentService.getInstance().upload(file, filename, path, token);
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Creation,
        actorIsAdmin: true,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: createdDocument.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
      setShowDialog(false);
      setHasUploadedFile(true);
      setFileID(createdDocument.id);
      displayToast(t('smqSurvey.generalInfo.stepTwo.uploadSuccess'));
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
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

  function SelectOrgChartDialog() {
    return (
      <TooltipAction
        showDialog={showDialog}
        title={t('smqSurvey.generalInfo.stepTwo.uploadOrgChart')}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={() => setShowDialog(false)}
        popoverActions={popoverActions}
      />
    )
  }

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    );
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={stepNumber}/>
        {ContinueButton()}
      </View>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('smqSurvey.generalInfo.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={AdditionnalComponent()}
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
                hasOrganizationalChart={hasOrganizationalChart} setHasOrganizationalChart={setHasOrganizationalChart}
                headquartersAddress={headquartersAddress} setHeadquartersAddress={setHeadquartersAddress}
                phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                email={email} setEmail={setEmail}
                setShowDialog={setShowDialog}
                hasUploadedFile={hasUploadedFile} selectedFilename={selectedFilename}
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
      {SelectOrgChartDialog()}
      {ToastContent()}
    </>
  );
}

export default SMQGeneralScreen;
