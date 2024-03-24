import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../assets/styles/components/PaginationStyles';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination(props: PaginationProps): React.JSX.Element {

  const { currentPage, totalPages, onPageChange } = props;
  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || i === currentPage || i === currentPage - 1 || i === currentPage + 1) {
      pageNumbers.push(i);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text>{"<"}</Text>
      </TouchableOpacity>
      {pageNumbers.map((number, index) => (
        <TouchableOpacity key={number} onPress={() => onPageChange(number)}>
          <Text style={styles.pageNumber}>
            {pageNumbers[index - 1] && number - pageNumbers[index - 1] > 1 ? `... ${number}` : number}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Pagination;