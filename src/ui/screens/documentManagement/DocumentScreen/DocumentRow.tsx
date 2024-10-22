import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import DocumentRowManager from '../../../../business-logic/manager/documentManagement/DocumentRowManager';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import IDocument from '../../../../business-logic/model/IDocument';
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

  const { currentClient, currentUser } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const navigation = useNavigation();

  // Async Methods
  async function navigateToDocument() {
    await DocumentRowManager.getInstance().logDocumentOpening(
      currentUser,
      currentClient,
      document,
      token,
    );
    navigation.navigate(NavigationRoutes.PDFScreen, {
      documentInput: document,
    });
  }

  return (
    <View style={styles.documentLineContainer}>
      <View style={styles.documentLineRow}>
        <TouchableOpacity onPress={() => navigateToDocument()}>
          <View style={styles.documentButton}>
            <Image source={pdfIcon} />
            <View style={styles.documentTextContainer}>
              <Text style={styles.documentText}>{document.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Tooltip action={() => showDocumentDialog(document)} />
      </View>
      <View style={styles.separator} />
    </View>
  );
}

export default DocumentRow;
