import type {
  ListRenderItem
} from '@react-native/virtualized-lists';
import React from 'react';
import {
  StyleSheet
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type GridProps<ItemT> = {
  data: Array<ItemT> | null | undefined;
  keyExtractor?: ((item: ItemT, index: number) => string) | undefined;
  renderItem: ListRenderItem<ItemT> | null | undefined;
}

function Grid<ItemT>(props: GridProps<ItemT>): React.JSX.Element {

  const { data, keyExtractor, renderItem } = props;

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {
        data && renderItem && data.map((item: ItemT, index: number) => {
          const key = keyExtractor ? keyExtractor(item, index) : String(index);
          return (
            <React.Fragment key={key}>
              {renderItem({ item, index, separators: { highlight: () => {}, unhighlight: () => {}, updateProps: (select: 'leading' | 'trailing', newProps: any) => {} } })}
            </React.Fragment>
          );
        })
      }     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
});

export default Grid;