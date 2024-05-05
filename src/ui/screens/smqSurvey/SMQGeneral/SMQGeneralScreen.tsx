import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';

import SMQGeneralStepOne from './SMQGeneralStepOne';

import Dialog from '../../../components/Dialogs/Dialog';
import Toast from '../../../components/Toast';

import SMQManagementScreen from '../SMQManagement/SMQManagementScreen';
import SMQGeneralStepThree from './SMQGeneralStepThree';
import SMQGeneralStepTwo from './SMQGeneralStepTwo';

import { setSMQSurveysListCount } from '../../../../business-logic/store/slices/smqReducer';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';
import SMQBuyScreen from '../SMQBuy/SMQBuyScreen';
import SMQClientRelationScreen from '../SMQClientRelation/SMQClientRelationScreen';
import SMQFabricationDevelopmentScreen from '../SMQFabricationDevelopment/SMQFabricationDevelopmentScreen';
import SMQMeasurementAndImprovement from '../SMQMeasurement/SMQMeasurementAndImprovement';
import SMQRegulatoryAffairs from '../SMQRegulatoryAffairs/SMQRegulatoryAffairsScreen';
import SMQResourcesManagementScreen from '../SMQResourcesManagement/SMQResourcesManagementScreen';

type SMQGeneralScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQGeneralScreen>;

function SMQGeneralScreen(props: SMQGeneralScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { smqSurveysListCount } = useAppSelector((state: RootState) => state.smq);
  const dispatch = useAppDispatch();
  // States
  const [showNavigationDialog, setShowNavigationDialog] = useState<boolean>(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
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
  // Management
  const [managementProcessusPilotName, setManagementProcessusPilotName] = useState<string>('');
  // Measurement and Improvement
  const [measurementProcessusPilotName, setMeasurementProcessusPilotName] = useState<string>('');
  // Fabrication Development
  const [fabProcessusPilotName, setFabProcessusPilotName] = useState<string>('');
  const [fabProductionFlux, setFabProductionFlux] = useState<string>('');
  const [fabProductIdentifications, setFabProductIdentifications] = useState<string>('');
  const [fabProductPreservation, setFabProductPreservation] = useState<string>('');
  const [fabProductTracking, setFabProductTracking] = useState<string>('');
  // Client Relation
  const [clientProcessusPilotName, setClientProcessusPilotName] = useState<string>('');
  const [selectedOrderID, setSelectedOrderID] = useState<string>('');
  const [selectedProductsID, setSelectedProductsID] = useState<string>('');
  // Buy
  const [buyProcessusPilotName, setBuyProcessusPilotName] = useState<string>('');
  // Resources Management
  const [resProcessusPilotName, setResProcessusPilotName] = useState<string>('');
  // Regulatory Affairs
  const [regProcessusPilotName, setRegProcessusPilotName] = useState<string>('');
  const [regSafeguardMeasures, setRegSafeguardMeasures] = useState<string>('');

  // Actions
  async function navigateBack(shouldSave: boolean) {
    if (shouldSave) {
      await saveCurrentState();
    }
    setShowNavigationDialog(false);
    navigation.goBack();
  }

  function displayNavigationDialog() {
    setShowNavigationDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function saveCurrentState() {
    await SMQManager.getInstance().continueAfterStepOne(
      companyName, companyHistory, managerName,
      medicalDevices, clients, area
    );
    await SMQManager.getInstance().continueAfterStepTwo(
      activity, qualityGoals, hasOrganizationalChart,
      headquartersAddress, phoneNumber, email, fileID
    );
    await SMQManager.getInstance().continueAfterStepThree(
      website, auditorsName, auditorsFunction,
      approversName, approversFunction
    );
    await SMQManager.getInstance().continueAfterManagementScreen(managementProcessusPilotName);
    await SMQManager.getInstance().continueAfterMeasurementAndImprovementScreen(measurementProcessusPilotName);
    await SMQManager.getInstance().continueAfterFabricationDevelopmentScreen(
      fabProcessusPilotName, fabProductionFlux,
      fabProductIdentifications, fabProductPreservation,
      fabProductTracking
    );
    await SMQManager.getInstance().continueAfterClientRelationScreen(
      clientProcessusPilotName, selectedOrderID, selectedProductsID
    );
    await SMQManager.getInstance().continueAfterBuyScreen(buyProcessusPilotName);
    await SMQManager.getInstance().continueAfterResourcesManagementScreen(resProcessusPilotName);
    await SMQManager.getInstance().continueAfterRegulatoryAffairsScreen(
      regProcessusPilotName, regSafeguardMeasures
    );
  }

  async function tappedSendToAPI() {
    // Send to API
    await saveCurrentState();
    try {
      await SMQManager.getInstance().sendToAPI(token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true); 
    }
    dispatch(setSMQSurveysListCount(smqSurveysListCount + 1));
    navigation.goBack();
  }

  // Components
  function SendButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.buttons.send')}
          onPress={() => setShowConfirmationDialog(true)}
        />
      </View>
    )
  }

  function NavigationDialog() {
    return (
      <Dialog
        title={t('smqSurvey.dialog.back.title')}
        description={t('smqSurvey.dialog.back.description')} // Voulez vous conserver les informations entrées ?
        confirmTitle={t('smqSurvey.dialog.back.confirm')}
        isConfirmAvailable={true}
        onConfirm={() => navigateBack(true)}
        cancelTitle={t('smqSurvey.dialog.back.cancel')}
        isCancelAvailable={true}
        onCancel={() => navigateBack(false)}
      />
    );
  }

  function ToastContent() {
    return (
      <Toast
        message={toastMessage}
        isVisible={showToast}
        setIsVisible={setShowToast}
        duration={2000}
        isShowingError={toastIsShowingError}
      />
    );
  }

  function ConfirmationDialog() {
    return (
      <Dialog
        title={t('smqSurvey.dialog.send.title')}
        description={t('smqSurvey.dialog.send.description')}
        confirmTitle={t('smqSurvey.dialog.send.confirm')}
        isConfirmAvailable={true}
        onConfirm={() => tappedSendToAPI()}
        cancelTitle={t('smqSurvey.dialog.send.cancel')}
        isCancelAvailable={true}
        onCancel={() => setShowConfirmationDialog(false)}
      />
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('smqSurvey.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={displayNavigationDialog}
        additionalComponent={SendButton()}
      >
        <ScrollView>
          <SMQGeneralStepOne
            companyName={companyName} setCompanyName={setCompanyName}
            companyHistory={companyHistory} setCompanyHistory={setCompanyHistory}
            managerName={managerName} setManagerName={setManagerName}
            medicalDevices={medicalDevices} setMedicalDevices={setMedicalDevices}
            clients={clients} setClients={setClients}
            area={area} setArea={setArea}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQGeneralStepTwo
            activity={activity} setActivity={setActivity}
            qualityGoals={qualityGoals} setQualityGoals={setQualityGoals}
            hasOrganizationalChart={hasOrganizationalChart} setHasOrganizationalChart={setHasOrganizationalChart}
            headquartersAddress={headquartersAddress} setHeadquartersAddress={setHeadquartersAddress}
            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            email={email} setEmail={setEmail}
            setShowDialog={setShowDialog}
            hasUploadedFile={hasUploadedFile}
            selectedFilename={selectedFilename} setFileID={setFileID}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQGeneralStepThree
            website={website} setWebsite={setWebsite}
            auditorsName={auditorsName} setAuditorsName={setAuditorsName}
            auditorsFunction={auditorsFunction} setAuditorsFunction={setAuditorsFunction}
            approversName={approversName} setApproversName={setApproversName}
            approversFunction={approversFunction} setApproversFunction={setApproversFunction}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQManagementScreen
            managementProcessusPilotName={managementProcessusPilotName}
            setManagementProcessusPilotName={setManagementProcessusPilotName}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQMeasurementAndImprovement
            measurementProcessusPilotName={measurementProcessusPilotName}
            setMeasurementProcessusPilotName={setMeasurementProcessusPilotName}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQFabricationDevelopmentScreen
            fabProcessusPilotName={fabProcessusPilotName} setFabProcessusPilotName={setFabProcessusPilotName}
            fabProductionFlux={fabProductionFlux} setFabProductionFlux={setFabProductionFlux}
            fabProductIdentifications={fabProductIdentifications} setFabProductIdentifications={setFabProductIdentifications}
            fabProductPreservation={fabProductPreservation} setFabProductPreservation={setFabProductPreservation}
            fabProductTracking={fabProductTracking} setFabProductTracking={setFabProductTracking}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQClientRelationScreen
            clientProcessusPilotName={clientProcessusPilotName} setClientProcessusPilotName={setClientProcessusPilotName}
            setSelectedOrderID={setSelectedOrderID}
            setSelectedProductsID={setSelectedProductsID}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQBuyScreen
            buyProcessusPilotName={buyProcessusPilotName} setBuyProcessusPilotName={setBuyProcessusPilotName}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQResourcesManagementScreen
            resProcessusPilotName={resProcessusPilotName} setResProcessusPilotName={setResProcessusPilotName}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
          <SMQRegulatoryAffairs
            regProcessusPilotName={regProcessusPilotName} setRegProcessusPilotName={setRegProcessusPilotName}
            regSafeguardMeasures={regSafeguardMeasures} setRegSafeguardMeasures={setRegSafeguardMeasures}
            editable={!showNavigationDialog && !showConfirmationDialog}
          />
        </ScrollView>
      </AppContainer>
      { showNavigationDialog && NavigationDialog() }
      { showToast && ToastContent() }
      { showConfirmationDialog && ConfirmationDialog() }
    </>
  );
}

export default SMQGeneralScreen;
