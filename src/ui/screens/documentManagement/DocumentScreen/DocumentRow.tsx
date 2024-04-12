import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import IDocument from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../../business-logic/model/enums/UserType';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import Tooltip from '../../../components/Tooltip';

import styles from '../../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentRowProps = {
  document: IDocument;
  showDocumentDialog: (item: IDocument) => void;
};

function DocumentRow(props: DocumentRowProps): React.JSX.Element {

  const pdfIcon = require('../../../assets/images/PDF_file_icon.png');

  const { document, showDocumentDialog } = props;

  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const navigation = useNavigation();

  async function navigateToDocument() {
    try {
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Visualisation,
        actorIsAdmin: currentUser?.userType == UserType.Admin,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: document.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
      navigation.navigate(NavigationRoutes.PDFScreen, { documentInput: document });
    } catch (error) {
      console.log('Error recording log for document:', document.id, error);
    }
  }

  return (
    <View style={styles.documentLineContainer}>
      <View style={styles.documentLineRow}>
        <TouchableOpacity onPress={() => navigateToDocument()}>
          <View style={styles.documentButton}>
            <Image source={pdfIcon}/>
            <View style={styles.documentTextContainer}>
              <Text style={styles.documentText}>
                {document.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Tooltip action={() => showDocumentDialog(document)} />
      </View>
      <View style={styles.separator}/>
    </View>
  );
}

export default DocumentRow;
