/**
 * Utility class containing date helper functions.
 */
class DateUtils {
  /**
   * Formats a month number to its corresponding name.
   * @param month - The month number to format.
   * @returns The name of the month.
   */
  static formatMonth(month: number, locale: string = 'fr-FR'): string {
    const frenchMonths = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];
    const englishMonths = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    // Ensure the month is within the correct range (0-11)
    if (month < 0 || month > 11) {
      throw new Error('Month must be between 0 (January) and 11 (December)');
    }

    const result =
      locale === 'fr-FR' ? frenchMonths[month] : englishMonths[month];

    return result;
  }

  /**
   * Formats a date to a string in the format 'YYYY-MM-DD'.
   * @param date - The date to format.
   * @returns A string representation of the date in the format 'YYYY-MM-DD'.
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are zero-indexed, so add 1 for correct month number
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a date to a string in the format 'DD/MM/YYYY'.
   * @param date - The date to format.
   * @returns A string representation of the date in the format 'DD/MM/YYYY'.
   */
  static formatStringDate(
    date: Date,
    monthFormat: 'numeric' | 'long' = 'long',
  ): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('fr-FR', { month: monthFormat });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  /**
   * Formats a day number to its corresponding name.
   * @param day - The day number to format.
   * @returns The name of the day.
   */
  static formatDay(day: number, locale: string = 'fr-FR'): string {
    const frenchWeekdays = [
      'lun.',
      'mar.',
      'mer.',
      'jeu.',
      'ven.',
      'sam.',
      'dim.',
    ];
    const englishWeekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    // Ensure the day is within a valid range (1-7)
    if (day < 1 || day > 7) {
      throw new Error('Day must be between 1 (Monday) and 7 (Sunday)');
    }

    // Map the day to the correct weekday in the array (0 for Monday, 6 for Sunday)
    const result =
      locale === 'fr-FR' ? frenchWeekdays[day - 1] : englishWeekDays[day - 1];
    return result;
  }

  static formatMonthYear(date: Date, locale: string = 'fr-FR') {
    const frenchMonths = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    const englishMonths = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const month =
      locale === 'fr-FR'
        ? frenchMonths[date.getMonth()]
        : englishMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }

  /**
   * Formats a time to a string in the format 'HH:MM'.
   * @param date - The date to format.
   * @returns A string representation of the time in the format 'HH:MM'.
   */
  static formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Get the date in the format 'YYYY-MM-DD'.
   * @param date - The date to format.
   * @returns The date in the format 'YYYY-MM-DD'.
   */
  static getJSFormatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

export default DateUtils;
