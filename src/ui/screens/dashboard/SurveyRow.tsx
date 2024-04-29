import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import ISurvey from '../../../business-logic/model/ISurvey';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import Tooltip from '../../components/Tooltip';

import styles from '../../assets/styles/dashboard/SurveysScreenStyles';

type SurveyRowProps = {
  survey: ISurvey;
  openActionDialog: (survey: ISurvey) => void;
};

function SurveyRow(props: SurveyRowProps): React.JSX.Element {

  const { survey, openActionDialog } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  // States
  const [clientName, setClientName] = useState<string>('');
  const [clientCompany, setClientCompany] = useState<string>('');

  async function loadClientName() {
    try {
      const clientID = survey.client.id;
      const user = await UserService.getInstance().getUserByID(clientID, token);
      setClientName(`${user.firstName} ${user.lastName}`);
      setClientCompany(user.companyName);
    } catch (error) {
      console.log('Error loading client name:', error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadClientName();
    }
    init();
  }, []);

  return (
    <TouchableOpacity style={styles.lineContainer} onPress={() => openActionDialog(survey)}>
      <View style={styles.lineRow}>
        <View style={styles.clientInfos}>
          <Text style={styles.dateText}>{clientName}</Text>
          <Text style={styles.companyText}>{clientCompany}</Text>
        </View>
        <Tooltip action={() => openActionDialog(survey)}/>
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
}

export default SurveyRow;