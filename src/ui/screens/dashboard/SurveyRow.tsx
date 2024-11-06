import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import ISurvey from '../../../business-logic/model/ISurvey';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import DateUtils from '../../../business-logic/utils/DateUtils';

import Tooltip from '../../components/Tooltip';

import styles from '../../assets/styles/dashboard/SurveysScreenStyles';

type SurveyRowProps = {
  survey: ISurvey;
  openActionDialog: (survey: ISurvey) => void;
};

function SurveyRow(props: SurveyRowProps): React.JSX.Element {
  const { survey, openActionDialog } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();
  // States
  const [clientName, setClientName] = useState<string>('');
  const [clientCompany, setClientCompany] = useState<string>('');
  const [createdAtText, setCreatedAtText] = useState<string>('');
  const [updatedAtText, setUpdatedAtText] = useState<string>('');

  // Sync Methods
  function loadDateInfos() {
    if (survey.createdAt) {
      const jsCreationDate = new Date(survey.createdAt);
      setCreationDateText(jsCreationDate);
      if (survey.updatedAt) {
        const jsUpdateDate = new Date(survey.updatedAt);
        const updateDateForComparison = DateUtils.getJSFormatDate(jsUpdateDate);
        const createDateForComparison = DateUtils.getJSFormatDate(jsCreationDate);
        if (updateDateForComparison > createDateForComparison) {
          setUpdateDateText(jsUpdateDate);
        }
      }
    }
  }

  function setCreationDateText(date: Date) {
    const formattedDate = DateUtils.formatStringDate(date);
    const formattedTime = DateUtils.formatTime(date);
    setCreatedAtText(
      `${t('smqSurvey.dates.createdOn')} ${formattedDate} ${t(
        'smqSurvey.dates.at',
      )} ${formattedTime}`,
    );
  }

  function setUpdateDateText(date: Date) {
    const updateFormattedDate = DateUtils.formatStringDate(date);
    const updateFormattedTime = DateUtils.formatTime(date);
    setUpdatedAtText(
      `${t('smqSurvey.dates.updatedOn')} ${updateFormattedDate} ${t(
        'smqSurvey.dates.at',
      )} ${updateFormattedTime}`,
    );
  }

  // Async Methods
  async function loadClientInfos() {
    try {
      const clientID = survey.client.id;
      const user = await UserServiceGet.getUserByID(clientID, token);
      setClientName(`${user.firstName} ${user.lastName}`);
      setClientCompany(user.companyName);
    } catch (error) {
      console.log('Error loading client name:', error);
    }
  }

  async function loadSurveyInfos() {
    await loadClientInfos();
    loadDateInfos();
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadSurveyInfos();
    }
    init();
  }, []);

  // Component
  return (
    <TouchableOpacity
      style={styles.lineContainer}
      onPress={() => openActionDialog(survey)}>
      <View style={styles.lineRow}>
        <View style={styles.clientInfos}>
          <Text style={styles.dateText}>{clientName}</Text>
          <Text style={styles.companyText}>{clientCompany}</Text>
          {createdAtText && (
            <Text style={styles.dateText}>{createdAtText}</Text>
          )}
          {updatedAtText && (
            <Text style={styles.dateText}>{updatedAtText}</Text>
          )}
        </View>
        <Tooltip action={() => openActionDialog(survey)} />
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
}

export default SurveyRow;
