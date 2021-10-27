
import { digitOnlyRegex } from "./regex-util";

// time in ms
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

// msOffset from Today 00:00:00 current TMZ -- how to get this? 

// new Date(msOffset +/- duration) -- provides new time point
export enum TimeType {
  DURATION = 'duration',
  TIMESTAMP = 'timestamp',
}

export enum TimeOperator {
  PLUS = 'plus',
  MINUS = 'minus',
  TO = 'to'
}

export enum ExpressionType {
  POINT_AND_DURATION = 'POINT_AND_DURATION',
  DURATION_AND_DURATION = 'DURATION_AND_DURATION',
  POINT_TO_POINT = 'POINT_TO_POINT',
}

export interface Time {
  value: number, // ms
  type: TimeType,
}

export interface ParsedExpression {
  expression: [Time, TimeOperator, Time], 
  type: ExpressionType,
}

export function parseExpression(input: string, is24hrTime: boolean): ParsedExpression | null {
  console.log('@parseExpression', `input: ${input}, is24hrTime: ${is24hrTime}`);
  // split string into 3 parts based on operator
  const parsedExpressionArray: [Time?, TimeOperator?, Time?] = [];
  let expressionArray = input.split(' ');
  if (expressionArray.length !== 3) {
    return null;
  }

  const [strVal1, strVal2, strVal3] = expressionArray;
  if (!strVal1 || !strVal2 || !strVal3) {
    return null;
  }
  const parsedTimeValue1 = getParsedTime(strVal1, is24hrTime);
  const parsedOperator = getParsedOperator(strVal2);
  const parsedTimeValue2 = getParsedTime(strVal3, is24hrTime);
  
  if (!parsedTimeValue1 || !parsedOperator || !parsedTimeValue2) {
    return null;
  }

  parsedExpressionArray.push(...[parsedTimeValue1, parsedOperator, parsedTimeValue2]);
  
  // Determine expression type
  let expressionType;
  if (parsedExpressionArray[0]?.type === TimeType.DURATION && parsedExpressionArray[2]?.type === TimeType.DURATION && parsedExpressionArray[1] !== TimeOperator.TO) {
    expressionType = ExpressionType.DURATION_AND_DURATION;
  } else if (
    parsedExpressionArray[0]?.type === TimeType.TIMESTAMP && parsedExpressionArray[2]?.type === TimeType.TIMESTAMP && parsedExpressionArray[1] === TimeOperator.TO
  ) {
    expressionType = ExpressionType.POINT_TO_POINT;
  } else if (
    parsedExpressionArray[0]?.type === TimeType.TIMESTAMP && parsedExpressionArray[2]?.type === TimeType.DURATION && parsedExpressionArray[1] !== TimeOperator.TO 
  ) {
    expressionType = ExpressionType.POINT_AND_DURATION;
  } else {
    return null; // invalid expresion detected.
  }

  console.log({
    expression: parsedExpressionArray,
    type: expressionType,
  });

  return {
    expression: parsedExpressionArray as [Time, TimeOperator, Time],
    type: expressionType,
  }
}

function getParsedTime(timeStr: string, is24hrTime: boolean): Time | null {
  const type = getTimeType(timeStr);
  if (type === TimeType.DURATION) {
    return {
      value: getDuration(timeStr),
      type,
    }
  }

  if (type === TimeType.TIMESTAMP) {
    return {
      value: getTimestamp(timeStr, is24hrTime),
      type,
    }
  }

  return null;
}

export function getParsedOperator(operatorStr: string): TimeOperator | null {
  switch (operatorStr) {
    case '+':
      return TimeOperator.PLUS;
    case '-':
      return TimeOperator.MINUS;
    case 'to':
      return TimeOperator.TO;
    default:
      return null;
  }
}

// TODO - additional validation to ensure that this is a valid timetype
// ie 04:00:00 - invalid, 5hr5 - invalid, 14:00pm - invalid
export function getTimeType(str: string): TimeType | null {
  if (str.includes(':')) {
    return isValidTimestampStr(str) ? TimeType.TIMESTAMP : null;
  }

  if (str.includes('hr') || str.includes('min')) {
    return isValidDurationStr(str) ? TimeType.DURATION : null;
  }

  return null;
}


/*
* strVal examples: "5:00", "5:00pm"
* "am/pm" will only be included if is24hrTime === false
* returns UTC timestamp in ms for the time TODAY.
*/
export function getTimestamp(strVal: string, is24hrTime: boolean): number {
  let isPM = false;
  let timeOnlyStr;
  if (!is24hrTime) {
    if (strVal.indexOf('pm') > -1) {
      isPM = true;
    }
    timeOnlyStr = strVal.slice(0, -2); // remove trailing 'am' or 'pm' if is24hrTime === false
  } else {
    timeOnlyStr = strVal;
  }

  const timeStrArray = timeOnlyStr.split(':');
  let hours = parseInt(timeStrArray[0]) + (isPM ? 12 : 0);
  // Correction needed for 12:xx am -ie 00:xx in 24hr time
  if (hours === 12 && !isPM && !is24hrTime) {
    hours = 0;
  }
  const minutes = parseInt(timeStrArray[1]);
  
  const today = new Date(Date.now());
  today.setHours(hours, minutes);
  return today.getTime();
}

/*
* strVal examples: "5hr", "30min", "5hr30min"
* returns duration in ms
*/
export function getDuration(strVal: string): number {
  let hoursStr = '';
  let minutesStr = '';
  let valueStr = '';

  // "hr" "min" -- skip "r" "i" and "n" chars - just use "h" and "m"
  const skipChars = ['r', 'i', 'n'];

  for (let char of strVal) {
    if (digitOnlyRegex.test(char)) {
      valueStr += char;
      continue;
    }

    if (char === 'h') {
      hoursStr = valueStr;
      valueStr = '';
      continue;
    }

    if (char === 'm') {
      minutesStr = valueStr;
      valueStr = '';
      continue;
    }

    if (skipChars.includes(char)) {
      continue;
    }
  }

  const hours = hoursStr.length ? parseInt(hoursStr) * HOUR : 0;
  const minutes = minutesStr.length ? parseInt(minutesStr) * MINUTE : 0;
  return hours + minutes;
}

export function isValidTimestampStr(timeStr: string): boolean {
  // TODO - add implementation
  return true;
}

export function isValidDurationStr(timeStr: string): boolean {
  // TODO - add implementation
  return true;
}