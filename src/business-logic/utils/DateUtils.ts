class DateUtils {
  // Month names for English and French
  private static monthNames = {
    en: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    fr: [
      'Janv',
      'Févr',
      'Mars',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sept',
      'Oct',
      'Nov',
      'Déc',
    ],
  };

  private static dayNames = {
    fr: ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'],
    en: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  };

  /**
   * Formats a given date into a human-readable string.
   * @param date - The date to format.
   * @param format - The desired format: 'DD MMM YYYY' (default) or 'DD/MM/YYYY'.
   * @param language - The language for formatting ('en' or 'fr'). Default is 'fr'.
   * @returns A formatted date string.
   */
  static formatDate(
    date: Date,
    format: 'DD MMM YYYY' | 'DD/MM/YYYY' = 'DD MMM YYYY',
    language: 'en' | 'fr' = 'fr',
  ): string {
    const day = date.getDate().toString().padStart(2, '0');
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const months = this.monthNames[language];

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${(monthIndex + 1).toString().padStart(2, '0')}/${year}`;
      case 'DD MMM YYYY':
      default:
        return `${day} ${months[monthIndex]} ${year}`;
    }
  }

  /**
   * Formats a given date object to a time string in HH:mm format.
   * @param date - The date to format.
   * @returns A formatted time string (HH:mm).
   */
  static formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  /**
   * Formats a given date object into a combined date and time string.
   * @param date - The date to format.
   * @param dateFormat - The desired date format: 'DD MMM YYYY' (default) or 'DD/MM/YYYY'.
   * @param language - The language for formatting ('en' or 'fr'). Default is 'fr'.
   * @returns A formatted date and time string.
   */
  static formatDateTime(
    date: Date,
    dateFormat: 'DD MMM YYYY' | 'DD/MM/YYYY' = 'DD MMM YYYY',
    language: 'en' | 'fr' = 'fr',
  ): string {
    const formattedDate = this.formatDate(date, dateFormat, language);
    const formattedTime = this.formatTime(date);

    return `${formattedDate} ${formattedTime}`;
  }

  /**
   * Formats a day number to its corresponding name.
   * @param day - The day number to format.
   * @param language - The language for formatting ('en' or 'fr'). Default is 'fr'.
   * @returns The name of the day.
   */
  static formatDay(day: number, language: 'en' | 'fr' = 'fr'): string {
    // Ensure the day is within a valid range (1-7)
    if (day < 1 || day > 7) {
      throw new Error('Day must be between 1 (Monday) and 7 (Sunday)');
    }

    // Map the day to the correct weekday in the array (0 for Monday, 6 for Sunday)
    const result =
      language === 'fr' ? this.dayNames.fr[day - 1] : this.dayNames.en[day - 1];
    return result;
  }

  /**
   * Formats a month number to its corresponding name.
   * @param month - The month number to format.
   * @param language - The language for formatting ('en' or 'fr'). Default is 'fr'.
   * @returns The name of the month.
   */
  static formatMonth(month: number, language: 'en' | 'fr' = 'fr'): string {
    // Ensure the month is within the correct range (0-11)
    if (month < 0 || month > 11) {
      throw new Error('Month must be between 0 (January) and 11 (December)');
    }

    const result =
      language === 'fr' ? this.monthNames.fr[month] : this.monthNames.fr[month];

    return result;
  }

  /**
   * Formats a month number to its corresponding name.
   * @param date - The date to format.
   * @param language - The language for formatting ('en' or 'fr'). Default is 'fr'.
   * @returns The name of the month and the year with this format : MM YYYY.
   */
  static formatMonthYear(date: Date, language: 'en' | 'fr' = 'fr') {
    const month =
      language === 'fr'
        ? this.monthNames.fr[date.getMonth()]
        : this.monthNames.en[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }
}

export default DateUtils;
