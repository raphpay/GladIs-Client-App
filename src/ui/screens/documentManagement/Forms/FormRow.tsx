import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import IForm from '../../../../business-logic/model/IForm';

import Tooltip from '../../../components/Tooltip';

import styles from '../../../assets/styles/forms/FormRowStyles';

type FormRowProps = {
  form: IForm;
};

function FormRow(props: FormRowProps): React.JSX.Element {


  const { form } = props;

  return (
    <View style={styles.documentLineContainer}>
      <View style={styles.documentLineRow}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.documentButton}>
            <View style={styles.documentTextContainer}>
              <Text style={styles.documentText}>
                {form.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Tooltip action={() => {}} />
      </View>
      <View style={styles.separator}/>
    </View>
  );
}

export default FormRow;
