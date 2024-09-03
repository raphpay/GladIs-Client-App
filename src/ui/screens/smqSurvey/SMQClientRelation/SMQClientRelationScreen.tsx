import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IFile from '../../../../business-logic/model/IFile';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import PlatformName from '../../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../../business-logic/modules/FinderModule';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentServicePost from '../../../../business-logic/services/DocumentService/DocumentService.post';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import TextButton from '../../../components/Buttons/TextButton';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';
import Toast from '../../../components/Toast';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQClientRelationScreenProps = {
  clientProcessusPilotName: string;
  setClientProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedOrderID: React.Dispatch<React.SetStateAction<string>>;
  setSelectedProductsID: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

type FileSource = {
  name: string;
}

function SMQClientRelationScreen(props: SMQClientRelationScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const {
    clientProcessusPilotName, setClientProcessusPilotName,
    setSelectedOrderID,
    setSelectedProductsID,
    editable
  } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);
  // States
  const [hasUploadedOrder, setHasUploadedOrder] = React.useState<boolean>(false);
  const [selectedOrderFilename, setSelectedOrderFilename] = React.useState<string>('');
  const [hasUploadedProducts, setHasUploadedProducts] = React.useState<boolean>(false);
  const [selectedProductsFilename, setSelectedProductsFilename] = React.useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const orderFileSource: FileSource = {name: 'orderDeliveryNote'};
  const productsFileSource: FileSource = {name: 'productsSold'};

  // Sync Methods
  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setClientProcessusPilotName(surveyData['26']);
        if (surveyData['27']) {
          setSelectedOrderID(surveyData['27']);
          setHasUploadedOrder(true);
        }
        if (surveyData['28']) {
          setSelectedProductsID(surveyData['28']);
          setHasUploadedProducts(true);
        }
      }
    }
  }

  async function selectPDFFile(source: FileSource) {
    const filename = `${source.name}.pdf`;
    if (source.name === orderFileSource.name) {
      setSelectedOrderFilename(filename);
    } else {
      setSelectedProductsFilename(filename);
    }
    const path = Utils.removeWhitespace(`${currentClient?.companyName ?? "noCompany"}/smqSurvey/`);
    let data: string = '';
    if (Platform.OS !== PlatformName.Mac) {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
      data = await Utils.getFileBase64FromURI(doc.uri) as string;
    } else {
      data = await FinderModule.getInstance().pickPDF();
    }
    try {
      const file: IFile = { data, filename: filename}
      const createdDocument = await DocumentServicePost.upload(file, filename, path, token);
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
    init();
  }, []);

  // Components
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

  return (
    <>
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.clientRelation.title')}</Text>
      <GladisTextInput
        value={clientProcessusPilotName}
        onValueChange={setClientProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
        editable
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
      {ToastContent()}
    </>
  );
}

export default SMQClientRelationScreen;
