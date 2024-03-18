import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView } from 'react-native';
import Pdf from 'react-native-pdf';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import PlatformName from '../../../business-logic/model/enums/PlatformName';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');

  const docIcon = require('../../assets/images/doc.fill.png');
  const backIcon = require('../../assets/images/arrowshape.turn.up.left.png');

  const { t } = useTranslation();
  const { navigation } = props;
  const { documentInput } = props.route.params;

  const { token } = useAppSelector((state: RootState) => state.tokens);

  function navigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function init() {
      let data = await DocumentService.getInstance().download(documentInput.id as string, token);
      if (Platform.OS === PlatformName.Android) {
        data = Utils.changeMimeType(data, 'application/pdf');
      }
      setPDFData(data)
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {
        pdfData ? (
          <Pdf
          source={{uri: pdfData}}
          onLoadProgress={(percent) => {
            console.log('percent loaded', percent );
          }}
          onLoadComplete={(numberOfPages: number, filePath: string) => {
              console.log(`Number of pages: ${numberOfPages}`, filePath);
          }}
          onPageChanged={(page: number, numberOfPages: number) => {
              console.log(`Current page: ${page}`, numberOfPages);
          }}
          onError={(error: string) => {
              console.log(error);
          }}
          onPressLink={(uri: string) => {
              console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}/>
        ) : (
          <ContentUnavailableView
            title={t('documentsScreen.noDocs.title')}
            message={t('documentsScreen.noDocs.message.client')}
            image={docIcon}
          />
        )
      }
      <IconButton
        title={t('components.buttons.back')}
        icon={backIcon}
        onPress={navigateBack}
        style={styles.backButton}
      />
    </SafeAreaView>
  );
}

export default PDFScreen;