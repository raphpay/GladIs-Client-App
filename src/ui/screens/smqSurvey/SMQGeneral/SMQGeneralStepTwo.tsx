import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { ICheckBoxOption } from '../../../../business-logic/model/IModule';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../../business-logic/services/CacheService';

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
};

function SMQGeneralStepTwo(props: SMQGeneralStepTwoProps): React.JSX.Element {

  const {
    activity, setActivity,
    qualityGoals, setQualityGoals,
    hasOrganizationalChart, setHasOrganizationalChart,
    headquartersAddress, setHeadquartersAddress,
    phoneNumber, setPhoneNumber,
    email, setEmail,
    setShowDialog,
    hasUploadedFile, selectedFilename
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
    }
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
    try {
      const cachedClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      if (cachedClientSurvey) {
        const generalSection = cachedClientSurvey?.survey?.generalSection;
        if (generalSection) {
          setActivity(generalSection.activity);
          setQualityGoals(generalSection.qualityGoals);
          setHasOrganizationalChart(generalSection.hasOrganizationalChart);
          setHeadquartersAddress(generalSection.headquartersAddress);
          setPhoneNumber(generalSection.phoneNumber);
          setEmail(generalSection.email);
          setSelectedOptionID(generalSection.hasOrganizationalChart ? '1' : '2');
        }
      }
    } catch (error) {
      console.log('Error retrieving cached client survey value', error);
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
    <ScrollView>
      <GladisTextInput
        value={activity}
        onValueChange={setActivity}
        placeholder={t('smqSurvey.generalInfo.stepTwo.activity')}
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
      {
        hasOrganizationalChart && (
          <View style={styles.selectFileRow}>
            <TextButton width={'30%'} title={t('smqSurvey.generalInfo.stepTwo.uploadOrgChart')} onPress={() => setShowDialog(true)} />
            {
              hasUploadedFile && selectedFilename && (
                <>
                  <Text style={styles.selectedFileText}>Selected File:</Text>
                  <Text style={styles.selectedFileText}>{selectedFilename}</Text>
                </>
              )
            }
          </View>
        )
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
