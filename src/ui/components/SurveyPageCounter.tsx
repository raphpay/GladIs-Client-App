import React from 'react';
import { Text } from 'react-native';
import styles from '../assets/styles/components/SurveyPageCounterStyles';


type SurveyPageCounterProps = {
  page: number;
};

function SurveyPageCounter(props: SurveyPageCounterProps): React.JSX.Element {

  const { page } = props;
  return (
    <Text style={styles.pageText}>{page}/10</Text>
  );
}

export default SurveyPageCounter;
