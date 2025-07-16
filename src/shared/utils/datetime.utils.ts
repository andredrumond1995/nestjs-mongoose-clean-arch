import { DATE_TIME_FORMATS, TIMEZONES } from '@shared/application/constants/datetime.constants';
import * as moment from 'moment-timezone';

export interface IFormatDatetimeParams {
  value: string | Date;
  outputFormat?: string;
  inputFormat?: string | moment.MomentBuiltinFormat;
  timezone?: string;
  returnAsDate?: boolean;
}
export const formatDatetime = ({
  value,
  outputFormat = DATE_TIME_FORMATS.DEFAULT,
  inputFormat,
  timezone = TIMEZONES.AMERICA_SAO_PAULO,
  returnAsDate = false,
}: IFormatDatetimeParams): string | Date => {
  let result;
  if (inputFormat) {
    result = moment.tz(value as string, inputFormat, timezone).format(outputFormat);
  } else {
    result = moment(value).tz(timezone).format(outputFormat);
  }

  return returnAsDate ? moment.utc(result, outputFormat, timezone).toDate() : result;
};

export const isValidDateFormat = (value: string | Date, format: string): boolean => {
  return moment(value, format, true).isValid();
};

export const isDateString = (value: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
  return dateRegex.test(value);
};

export function parseFlexibleDate(input: string): Date | null {
  const trimmed = input.trim();
  const now = new Date();
  const currentYear = now.getFullYear();

  let day: number | undefined;
  let month: number | undefined;
  let year: number | undefined;

  // Pattern: dd/MM/yyyy
  const fullDateMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (fullDateMatch) {
    day = parseInt(fullDateMatch[1], 10);
    month = parseInt(fullDateMatch[2], 10) - 1; // JS months 0-11
    year = parseInt(fullDateMatch[3], 10);
  }

  // Pattern: dd/MM
  const dayMonthMatch = trimmed.match(/^(\d{2})\/(\d{2})$/);
  if (dayMonthMatch) {
    day = parseInt(dayMonthMatch[1], 10);
    month = parseInt(dayMonthMatch[2], 10) - 1;
    year = currentYear;
  }

  // Pattern: MM/yyyy
  const monthYearMatch = trimmed.match(/^(\d{2})\/(\d{4})$/);
  if (monthYearMatch) {
    day = 1;
    month = parseInt(monthYearMatch[1], 10) - 1;
    year = parseInt(monthYearMatch[2], 10);
  }

  // If nothing matched, return null
  if (day === undefined || month === undefined || year === undefined) {
    return null;
  }

  const date = new Date(year, month, day);

  // Check if it's valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}
