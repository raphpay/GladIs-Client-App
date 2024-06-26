import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  View
} from 'react-native';

import { IActionItem } from '../../../../business-logic/model/IAction';

import styles from '../../../assets/styles/components/DashboardAdminGridStyles';

import ActionGridItem from './ActionGridItem';

type ActionSectionProps = {
  passwordResetAction?: IActionItem;
  messagesAction?: IActionItem;
  surveysAction?: IActionItem;
};

function ActionSection(props: ActionSectionProps): React.JSX.Element {

  const { passwordResetAction, messagesAction, surveysAction } = props;

  const { t } = useTranslation();

  return (
    <>
      {
        (passwordResetAction || messagesAction || surveysAction) && (
          <View style={styles.actionSectionContainer}>
            <Text style={styles.sectionTitle}>{t('dashboard.sections.actions.title')}</Text>
            <ScrollView
              contentContainerStyle={styles.actionScrollView}
              scrollEnabled={false}
              horizontal={true}
              showsVerticalScrollIndicator={false}
            >
              { passwordResetAction && <ActionGridItem item={passwordResetAction} /> }
              { messagesAction && <ActionGridItem item={messagesAction} /> }
              { surveysAction && <ActionGridItem item={surveysAction} /> }
            </ScrollView>
          </View>
        )
      }
    </>
  );
}


export default ActionSection;