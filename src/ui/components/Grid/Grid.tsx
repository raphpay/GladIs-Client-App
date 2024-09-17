import type { ListRenderItem } from '@react-native/virtualized-lists';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';

import PlatformName from '../../../business-logic/model/enums/PlatformName';

import styles from '../../assets/styles/components/GridStyles';

type GridProps<ItemT> = {
  data: Array<ItemT> | null | undefined;
  keyExtractor?: ((item: ItemT, index: number) => string) | undefined;
  renderItem: ListRenderItem<ItemT> | null | undefined;
  scrollEnabled?: boolean;
};

function Grid<ItemT>(props: GridProps<ItemT>): React.JSX.Element {
  const {
    data,
    keyExtractor,
    renderItem,
    scrollEnabled = true,
  } = props;

  function WindowsComponent() {
    return (
      <View>
        {data && renderItem && data.map((item: ItemT, index: number) => {
          const key = keyExtractor ? keyExtractor(item, index) : String(index);
          return (
            <React.Fragment key={key}>
              {renderItem({
                item,
                index,
                separators: {
                  highlight: () => {},
                  unhighlight: () => {},
                  updateProps: (select: 'leading' | 'trailing', newProps: any) => {},
                },
              })}
            </React.Fragment>
          );
        })}
      </View>
    );
  }

  function AllPlatformsComponent() {
    return (
      <ScrollView
        contentContainerStyle={styles.grid}
        scrollEnabled={scrollEnabled}
      >
        {data && renderItem && data.map((item: ItemT, index: number) => {
          const key = keyExtractor ? keyExtractor(item, index) : String(index);
          return (
            <React.Fragment key={key}>
              {renderItem({
                item,
                index,
                separators: {
                  highlight: () => {},
                  unhighlight: () => {},
                  updateProps: (select: 'leading' | 'trailing', newProps: any) => {},
                },
              })}
            </React.Fragment>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <>
      {Platform.OS === PlatformName.Windows ? (
        <WindowsComponent />
      ) : (
        <AllPlatformsComponent />
      )}
    </>
  );
}

export default Grid;