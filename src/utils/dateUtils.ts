import { format, add, sub, startOfYear, endOfYear, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, 'dd-MMM-yyyy')} > ${format(endDate, 'dd-MMM-yyyy')}`;
};

export const getDateRangeForView = (date: Date, view: string): { start: Date; end: Date } => {
  switch (view) {
    case 'Daily':
      return {
        start: date,
        end: date
      };
    case 'Weekly':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
      };
    case 'Monthly':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
    case 'Yearly':
      return {
        start: startOfYear(date),
        end: endOfYear(date)
      };
    default:
      return {
        start: date,
        end: date
      };
  }
};

export const getNextDate = (date: Date, view: string): Date => {
  switch (view) {
    case 'Daily':
      return add(date, { days: 1 });
    case 'Weekly':
      return add(date, { weeks: 1 });
    case 'Monthly':
      return add(date, { months: 1 });
    case 'Yearly':
      return add(date, { years: 1 });
    default:
      return date;
  }
};

export const getPreviousDate = (date: Date, view: string): Date => {
  switch (view) {
    case 'Daily':
      return sub(date, { days: 1 });
    case 'Weekly':
      return sub(date, { weeks: 1 });
    case 'Monthly':
      return sub(date, { months: 1 });
    case 'Yearly':
      return sub(date, { years: 1 });
    default:
      return date;
  }
};
