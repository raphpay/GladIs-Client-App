import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import { ICheckBoxOption } from '../../../../business-logic/model/IModule';

import TextButton from '../../../components/Buttons/TextButton';
import CheckBox from '../../../components/CheckBox/CheckBox';
import ExpandingTextInput from '../../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

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
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  hasUploadedFile: boolean;
  selectedFilename: string;
  setFileID: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

function SMQGeneralStepTwo(props: SMQGeneralStepTwoProps): React.JSX.Element {
  const {
    activity,
    setActivity,
    qualityGoals,
    setQualityGoals,
    hasOrganizationalChart,
    setHasOrganizationalChart,
    headquartersAddress,
    setHeadquartersAddress,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    setShowDialog,
    hasUploadedFile,
    selectedFilename,
    setFileID,
    editable,
  } = props;
  const { t } = useTranslation();

  // States
  const [selectedOptionID, setSelectedOptionID] = useState<string>('');

  const organizationOptions: ICheckBoxOption[] = [
    {
      id: '1',
      name: t('smqSurvey.generalInfo.stepTwo.option.yes'),
      value: true,
    },
    {
      id: '2',
      name: t('smqSurvey.generalInfo.stepTwo.option.no'),
      value: false,
    },
  ];

  // Sync Methods
  function toggleCheckbox(option: ICheckBoxOption) {
    setSelectedOptionID(option.id as string);
    setHasOrganizationalChart(option.value);
  }

  function isOptionSelected(option: ICheckBoxOption): boolean {
    const id = option.id as string;
    return selectedOptionID === id;
  }

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey && currentSurvey.value) {
      const surveyData = JSON.parse(currentSurvey.value);
      if (surveyData) {
        setActivity(surveyData['8']);
        setQualityGoals(surveyData['9']);
        setHasOrganizationalChart(surveyData['10']);
        setHeadquartersAddress(surveyData['11']);
        setPhoneNumber(surveyData['12']);
        setEmail(surveyData['13']);
        setFileID(surveyData['organizationalChartID']);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init();
  }, []);

  // TODO: Add trash button to remove selected file
  // Components
  return (
    <>
      <GladisTextInput
        value={activity}
        onValueChange={setActivity}
        placeholder={t('smqSurvey.generalInfo.stepTwo.activity')}
        showTitle={true}
        editable={editable}
      />
      <ExpandingTextInput
        text={qualityGoals}
        setText={setQualityGoals}
        placeholder={t('smqSurvey.generalInfo.stepTwo.qualityGoals')}
        editable={editable}
      />
      <Text style={styles.subtitle}>
        {t('smqSurvey.generalInfo.stepTwo.selectOrgOption')}
      </Text>
      {organizationOptions.map(option => {
        return (
          <CheckBox
            key={option.id}
            option={option}
            isSelected={isOptionSelected(option)}
            onSelectOption={() => toggleCheckbox(option)}
          />
        );
      })}
      {hasOrganizationalChart && (
        <View style={styles.selectFileRow}>
          <TextButton
            width={'30%'}
            title={t('smqSurvey.generalInfo.stepTwo.uploadOrgChart')}
            onPress={() => setShowDialog(true)}
          />
          {hasUploadedFile && selectedFilename && (
            <>
              <Text style={styles.selectedFileText}>Selected File:</Text>
              <Text style={styles.selectedFileText}>{selectedFilename}</Text>
            </>
          )}
        </View>
      )}
      <GladisTextInput
        value={headquartersAddress}
        onValueChange={setHeadquartersAddress}
        placeholder={t('smqSurvey.generalInfo.stepTwo.headquartersAddress')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={phoneNumber}
        onValueChange={setPhoneNumber}
        placeholder={t('smqSurvey.generalInfo.stepTwo.phoneNumber')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={email}
        onValueChange={setEmail}
        placeholder={t('smqSurvey.generalInfo.stepTwo.email')}
        showTitle={true}
        editable={editable}
      />
    </>
  );
}

export default SMQGeneralStepTwo;
