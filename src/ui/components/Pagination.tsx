import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/PaginationStyles';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): React.JSX.Element {
  const generatePageNumbers = (): (number | string)[] => {
    let pages: (number | string)[] = [];

    if (totalPages <= 3) {
      // For 3 or fewer total pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include the first page
      pages.push(1);

      // Logic for current page and dots
      if (currentPage > 2 && currentPage < totalPages - 1) {
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      } else if (currentPage === 2) {
        // If the current page is 2, show it and then dots
        pages.push(currentPage);
        pages.push('...');
      } else if (currentPage === totalPages - 1) {
        // If the current page is the second to last, show dots and then current page
        pages.push('...');
        pages.push(currentPage);
      } else {
        // For first and last page, no dots needed in between
        if (currentPage === 1 || currentPage === totalPages) {
          pages.push('...');
        }
      }

      // Always include the last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <Text>{"<"}</Text>
      </TouchableOpacity>
      {pageNumbers.map((number, index) =>
        typeof number === 'number' ? (
          <TouchableOpacity key={index} onPress={() => onPageChange(number)}>
            <Text style={[styles.pageNumber, {color: currentPage === number ? Colors.primary : Colors.black}]}>{number}</Text>
          </TouchableOpacity>
        ) : (
          <Text key={index} style={styles.pageNumber}>
            {number}
          </Text>
        )
      )}
      <TouchableOpacity
        onPress={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <Text>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Pagination;
