import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { IEvent } from '../../../business-logic/model/IEvent';
import Utils from '../../../business-logic/utils/Utils';

import Dialog from '../../components/Dialog';

import styles from '../../assets/styles/reminders/ListDialogStyles';

type ListEventsDialogProps = {
  daysEvents: IEvent[];
  showListDialog: boolean;
  setShowListDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function ListEventsDialog(props: ListEventsDialogProps): React.JSX.Element {

  const { daysEvents, showListDialog, setShowListDialog } = props;

  const eventsDate = daysEvents.length > 0 && new Date(daysEvents[0].date);
  const formatedEventsDate = eventsDate && Utils.formatStringDate(eventsDate);

  const { t } = useTranslation();

  return (
    <>
      {
        showListDialog && (
          <Dialog
            title={`${t('components.dialog.calendar.eventsOn')} ${formatedEventsDate}`}
            onConfirm={() => setShowListDialog(false)}
            onCancel={() => setShowListDialog(false)}
          >
            <>
            {
              daysEvents.map((event) => (
                <Text style={styles.eventText} key={event.id}>{event.name}</Text>
              ))
            }
            </>
          </Dialog>
        )
      }
    </>
  );
}

export default ListEventsDialog;