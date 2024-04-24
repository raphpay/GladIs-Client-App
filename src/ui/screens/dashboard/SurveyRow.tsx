import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import ISurvey from '../../../business-logic/model/ISurvey';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import Tooltip from '../../components/Tooltip';

import styles from '../../assets/styles/dashboard/SurveysScreenStyles';

type SurveyRowProps = {
  survey: ISurvey;
};

function SurveyRow(props: SurveyRowProps): React.JSX.Element {

  const { survey } = props;
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
    <View style={styles.lineContainer}>
      <View style={styles.lineRow}>
        <View style={styles.clientInfos}>
          <Text style={styles.dateText}>{clientName}</Text>
          <Text style={styles.companyText}>{clientCompany}</Text>
        </View>
        <Tooltip action={() => {}}/>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

export default SurveyRow;
