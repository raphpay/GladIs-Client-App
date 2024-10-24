import React from 'react';
import { useTranslation } from 'react-i18next';

import IDocument from '../../../../business-logic/model/IDocument';
import UserType from '../../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import ContentUnavailableView from '../../../components/ContentUnavailableView';
import Grid from '../../../components/Grid/Grid';
import DocumentRow from './DocumentRow';

type DocumentGridProps = {
  documentsFiltered: IDocument[];
  showDocumentDialog: (item: IDocument) => void;
};

function DocumentGrid(props: DocumentGridProps): React.JSX.Element {
  const { t } = useTranslation();
  const { documentsFiltered, showDocumentDialog } = props;

  const docIcon = require('../../../assets/images/doc.fill.png');

  const { currentUser } = useAppSelector((state: RootState) => state.users);

  return (
    <>
      {documentsFiltered.length !== 0 ? (
        <Grid
          data={documentsFiltered}
          renderItem={({ item }) => (
            <DocumentRow
              document={item}
              showDocumentDialog={showDocumentDialog}
            />
          )}
        />
      ) : (
        <ContentUnavailableView
          title={t('documentsScreen.noDocs.title')}
          message={
            currentUser?.userType === UserType.Admin
              ? t('documentsScreen.noDocs.message.admin')
              : t('documentsScreen.noDocs.message.client')
          }
          image={docIcon}
        />
      )}
    </>
  );
}

export default DocumentGrid;
