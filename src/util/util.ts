import QueryString from 'query-string';

function padStart(padNum: number, padValue: string, value: string): string {
  if (value.length < padNum) {
    const pad = String(padValue).repeat(padNum - value.length);
    return pad + value;
  }
  return value;
}

function getNestedAttr(obj: any, nestedAttr: string[]) {
  return nestedAttr.reduce(
    (nested, next) => (nested && nested[next] ? nested[next] : null),
    obj
  );
}

function getOptionsFromEnum(options: any) {
  return Object.keys(options).map((o) => ({
    label: options[o],
    value: options[o],
  }));
}

function input2date(date: number) {
  const dateStr = String(date);
  const dateFields = [
    dateStr.substr(0, 2),
    dateStr.substr(2, 2),
    dateStr.substr(4, 4),
  ];
  const formattedDate = new Date(
    Number(dateFields[2]),
    Number(dateFields[0]) - 1,
    Number(dateFields[1])
  );
  return formattedDate.toString();
}

function date2input(date: string) {
  const parsed = new Date(date);
  const day = padStart(2, '0', String(parsed.getDate()));
  const month = padStart(2, '0', String(parsed.getMonth() + 1));
  const year = parsed.getUTCFullYear();
  return `${month}${day}${year}`;
}

/**
 * @function datetime2input
 * @param date a string representation of a date.
 * @returns a string with the following format: MMDDYYYYhhmmss
 */
function datetime2input(date: string): string {
  const parsed = new Date(date);
  const sec = padStart(2, '0', String(parsed.getSeconds()));
  const min = padStart(2, '0', String(parsed.getMinutes()));
  const hour = padStart(2, '0', String(parsed.getHours()));
  const day = padStart(2, '0', String(parsed.getDate()));
  const month = padStart(2, '0', String(parsed.getMonth() + 1));
  const year = parsed.getUTCFullYear();
  return `${month}${day}${year}${hour}${min}${sec}`;
}

/**
 * @function input2datetime
 * @param date a number of the following format: MMDDYYYYhhmmss
 * @returns a string representation of a date. The format of the string depends on the locale.
 */
function input2datetime(date: number): string {
  const dateStr = String(date);
  const dateFields = [
    dateStr.substr(0, 2), // month
    dateStr.substr(2, 2), // day
    dateStr.substr(4, 4), // year
    dateStr.substr(8, 2), // hour
    dateStr.substr(10, 2), // min
    dateStr.substr(12, 2), // sec
  ];
  const formattedDate = new Date(
    Number(dateFields[2]),
    Number(dateFields[0]) - 1,
    Number(dateFields[1]),
    Number(dateFields[3]),
    Number(dateFields[4]),
    Number(dateFields[5])
  );
  return formattedDate.toString();
}

function date2age(date: string): string {
  const dob = new Date(date);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - dob.getFullYear();

  // Adjust if the birthday hasn't occurred yet this year
  if (
      currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() &&
        currentDate.getDate() < dob.getDate())
  ) {
      age--;
  }
  return age.toString();
}

/**
 * @function date2human
 * @description turns a date into a human-readable string
 * @param date any Date-parseable string
 */
function date2human(date: string) {
  const dateTimeFormat = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
  return dateTimeFormat.format(new Date(date));
}

function getValueFromQuery(key: string): string | undefined {
  const queries: any = QueryString.parse(window.location.search);
  return queries[key];
}

export {
  padStart,
  getNestedAttr,
  getOptionsFromEnum,
  getValueFromQuery,
  input2date,
  date2age,
  date2input,
  datetime2input,
  input2datetime,
  date2human,
};
