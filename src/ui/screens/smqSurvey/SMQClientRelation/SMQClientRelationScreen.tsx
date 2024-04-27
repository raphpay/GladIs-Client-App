import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, Text, View } from 'react-native';
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
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';
import Toast from '../../../components/Toast';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQClientRelationScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQClientRelationScreen>;

type FileSource = {
  name: string;
}

function SMQClientRelationScreen(props: SMQClientRelationScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);
  const { currentSurvey } = useAppSelector((state: RootState) => state.appState);
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');
  const [orderDeliveryNote, setOrderDeliveryNote] = React.useState<string>('');
  const [productsSold, setProductsSold] = React.useState<string>('');
  const [hasUploadedOrder, setHasUploadedOrder] = React.useState<boolean>(false);
  const [selectedOrderFilename, setSelectedOrderFilename] = React.useState<string>('');
  const [selectedOrderID, setSelectedOrderID] = React.useState<string>('');
  const [hasUploadedProducts, setHasUploadedProducts] = React.useState<boolean>(false);
  const [selectedProductsFilename, setSelectedProductsFilename] = React.useState<string>('');
  const [selectedProductsID, setSelectedProductsID] = React.useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.fabricationDevelopment.title'),
      onPress: () => navigateBack(),
    }
  ];

  const orderFileSource: FileSource = {name: 'orderDeliveryNote'};
  const productsFileSource: FileSource = {name: 'productsSold'};

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    if (processusPilotName) {
      isFilled = processusPilotName.length > 0;
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
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "prs": {
          "clientRelation": {
            processusPilotName,
            orderDeliveryNote,
            productsSold,
            orderDeliveryNoteID: selectedOrderID,
            productsSoldID: selectedProductsID,
          }
        }
      }
    };
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const clientRelation = clientSurvey.survey.prs.clientRelation;
    if (clientRelation) {
      // Update management sub-section with new data
      existingClientSurvey.survey.prs.clientRelation = clientRelation;
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
      await CacheService.getInstance().storeValue(CacheKeys.isSMQFormFilled, isFormFilled());
      navigation.navigate(NavigationRoutes.SMQBuyScreen);
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
    const clientRelation = surveyValue?.survey?.prs?.clientRelation;
    if (clientRelation) {
      setProcessusPilotName(clientRelation.processusPilotName);
      setOrderDeliveryNote(clientRelation.orderDeliveryNote);
      setProductsSold(clientRelation.productsSold);
    }
  }

  async function loadFromCache() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      const clientRelation = cachedSurvey?.survey?.prs?.clientRelation;
      if (clientRelation) {
        setProcessusPilotName(clientRelation.processusPilotName);
        setOrderDeliveryNote(clientRelation.orderDeliveryNote);
        setProductsSold(clientRelation.productsSold);
      }
    } catch (error) {
      console.log('Error retrieving cached value', error);
    }
  }

  async function selectPDFFile(source: FileSource) {
    const filename = `${source.name}.pdf`;
    if (source.name === orderFileSource.name) {
      setSelectedOrderFilename(filename);
    } else {
      setSelectedProductsFilename(filename);
    }
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
      if (source.name === orderFileSource.name) {
        setHasUploadedOrder(true);
        setSelectedOrderID(createdDocument.id);
      } else {
        setHasUploadedProducts(true);
        setSelectedProductsID(createdDocument.id);
      }
      setHasUploadedOrder(true);
      setSelectedOrderID(createdDocument.id);
      displayToast(t('smqSurvey.generalInfo.stepTwo.uploadSuccess'));
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
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
        <SurveyPageCounter page={7}/>
        {ContinueButton()}
      </View>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('smqSurvey.prs.clientRelation.title')}
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
          <Text style={styles.title}>
            {t('smqSurvey.prs.clientRelation.orderDeliveryNote')}
          </Text>
          <View style={styles.selectFileRow}>
            <TextButton
              width={'30%'}
              title={t('smqSurvey.prs.clientRelation.orderDeliveryNoteButton')}
              onPress={() => selectPDFFile(orderFileSource)} 
            />
            {
              hasUploadedOrder && selectedOrderFilename && (
                <>
                  <Text style={styles.selectedFileText}>Selected File:</Text>
                  <Text style={styles.selectedFileText}>{selectedOrderFilename}</Text>
                </>
              )
            }
          </View>
          <Text style={styles.title}>
            {t('smqSurvey.prs.clientRelation.productsSold')}
          </Text>
          <View style={styles.selectFileRow}>
            <TextButton
              width={'30%'}
              title={t('smqSurvey.prs.clientRelation.orderDeliveryNoteButton')}
              onPress={() => selectPDFFile(productsFileSource)} 
            />
            {
              hasUploadedProducts && selectedProductsFilename && (
                <>
                  <Text style={styles.selectedFileText}>Selected File:</Text>
                  <Text style={styles.selectedFileText}>{selectedProductsFilename}</Text>
                </>
              )
            }
          </View>
        </ScrollView>
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default SMQClientRelationScreen;
