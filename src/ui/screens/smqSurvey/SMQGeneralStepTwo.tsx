import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text } from 'react-native';

import { ICheckBoxOption } from '../../../business-logic/model/IModule';

import CheckBox from '../../components/CheckBox/CheckBox';
import ExpandingTextInput from '../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

import styles from '../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralStepTwoProps = {
  activity: string;
  setActivity: React.Dispatch<React.SetStateAction<string>>;
  qualityGoals: string;
  setQualityGoals: React.Dispatch<React.SetStateAction<string>>;
  hasOrganizationalChart: boolean;
  setHasOrganizationalChart: React.Dispatch<React.SetStateAction<boolean>>;
  headquartersAddress: string;
  setHeadquartersAddress: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

function SMQGeneralStepTwo(props: SMQGeneralStepTwoProps): React.JSX.Element {

  const {
    activity, setActivity,
    qualityGoals, setQualityGoals,
    hasOrganizationalChart, setHasOrganizationalChart,
    headquartersAddress, setHeadquartersAddress,
    phoneNumber, setPhoneNumber,
    email, setEmail,
  } = props;
  const { t } = useTranslation();

  // States
  const [selectedOptionID, setSelectedOptionID] = useState<string>('');

  const organizationOptions: ICheckBoxOption[] = [
    {
      id: '1',
      name: 'Yes',
      value: true,
    },
    {
      id: '2',
      name: 'No',
      value: false,
    }
  ];

  // Sync Methods
  function loadInfos() {
    // if (currentClient) {
    //   setCompanyName(currentClient.companyName);
    // }
  }

  function toggleCheckbox(option: ICheckBoxOption) {
    setSelectedOptionID(option.id as string);
  }

  function isOptionSelected(option: ICheckBoxOption): boolean {
    const id = option.id as string;
    return selectedOptionID === id;
  }

  // Lifecycle Methods
  useEffect(() => {
    loadInfos();
  }, []);

  // TODO: Implement logo upload if yes
  // Components
  return (
    <ScrollView>
      <GladisTextInput
        value={activity}
        onValueChange={setActivity}
        placeholder={t('smqSurvey.generalInfo.stepTwo.qualityGoals')}
        showTitle={true}
      />
      <ExpandingTextInput
        text={qualityGoals}
        setText={setQualityGoals}
        placeholder={t('smqSurvey.generalInfo.stepTwo.qualityGoals')}
      />
      <Text style={styles.subtitle}>{t('smqSurvey.generalInfo.stepTwo.selectOrgOption')}</Text>
      {
        organizationOptions.map((option) => {
          return (
            <CheckBox
              key={option.id}
              option={option}
              isSelected={isOptionSelected(option)}
              onSelectOption={() => toggleCheckbox(option)}
            />
          );
        })
      }
      <GladisTextInput
        value={headquartersAddress}
        onValueChange={setHeadquartersAddress}
        placeholder={t('smqSurvey.generalInfo.stepTwo.headquartersAddress')}
        showTitle={true}
      />
      <GladisTextInput
        value={phoneNumber}
        onValueChange={setPhoneNumber}
        placeholder={t('smqSurvey.generalInfo.stepTwo.phoneNumber')}
        showTitle={true}
      />
      <GladisTextInput
        value={email}
        onValueChange={setEmail}
        placeholder={t('smqSurvey.generalInfo.stepTwo.email')}
        showTitle={true}
      />
    </ScrollView>
  );
}

export default SMQGeneralStepTwo;
