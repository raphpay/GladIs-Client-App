import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity } from 'react-native';

import { IEvent } from '../../../business-logic/model/IEvent';
import Utils from '../../../business-logic/utils/Utils';

import Dialog from '../../components/Dialogs/Dialog';

import styles from '../../assets/styles/reminders/ListDialogStyles';

type ListEventsDialogProps = {
  daysEvents: IEvent[];
  showListDialog: boolean;
  setShowListDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEventDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
};

function ListEventsDialog(props: ListEventsDialogProps): React.JSX.Element {

  const {
    daysEvents,
    showListDialog,
    setShowListDialog, setShowEventDialog,
    setSelectedEvent,
  } = props;

  const eventsDate = daysEvents.length > 0 && new Date(daysEvents[0].date);
  const formatedEventsDate = eventsDate && Utils.formatStringDate(eventsDate);
  const achivedIcon = require('../../assets/images/archivebox.png');

  const { t } = useTranslation();

  function openSingleEventDialog(event: IEvent) {
    setSelectedEvent(event);
    setShowEventDialog(true);
    setShowListDialog(false);
  }

  function DayButton(event: IEvent) {
    const isArchived = event.deletedAt !== null;
    const opacity = isArchived ? 0.7 : 1;

    return (
      <TouchableOpacity
        key={event.id}
        onPress={() => openSingleEventDialog(event)}
        style={styles.eventButton}
      >
        {isArchived && <Image source={achivedIcon} style={styles.archivedIcon} />}
        <Text style={{...styles.eventText, opacity}}>{event.name}</Text>
      </TouchableOpacity>
    );
  }

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
                daysEvents.map((event) => DayButton(event))
              }
            </>
          </Dialog>
        )
      }
    </>
  );
}

export default ListEventsDialog;