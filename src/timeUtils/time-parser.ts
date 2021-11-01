
import { digitOnlyRegex } from './regex-util';

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

export enum OperationType {
  POINT_AND_DURATION = 'POINT_AND_DURATION',
  DURATION_AND_DURATION = 'DURATION_AND_DURATION',
  POINT_TO_POINT = 'POINT_TO_POINT',
}

export interface Time {
  value: number, // ms
  type: TimeType,
}

export type ParsedExpression = [Time, TimeOperator, Time];

export interface ParsedOperation {
  expression: ParsedExpression, 
  type: OperationType,
}

export class TimeParser {
  public is24hrTime: boolean;

  constructor(is24hrTime: boolean = false) {
    this.is24hrTime = is24hrTime;
  }

  public set24hrTime(enable: boolean) {
    this.is24hrTime = enable;
  }

  public parseExpression(input: string): ParsedOperation | null {
    console.log('@parseExpression', `input: ${input}, is24hrTime: ${this.is24hrTime}`);
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
    const parsedTimeValue1 = this.getParsedTime(strVal1);
    const parsedOperator = this.getParsedOperator(strVal2);
    const parsedTimeValue2 = this.getParsedTime(strVal3);
    
    if (!parsedTimeValue1 || !parsedOperator || !parsedTimeValue2) {
      return null;
    }

    parsedExpressionArray.push(...[parsedTimeValue1, parsedOperator, parsedTimeValue2]);
    
    // Determine expression type
    let expressionType;
    if (parsedExpressionArray[0]?.type === TimeType.DURATION && parsedExpressionArray[2]?.type === TimeType.DURATION && parsedExpressionArray[1] !== TimeOperator.TO) {
      expressionType = OperationType.DURATION_AND_DURATION;
    } else if (
      parsedExpressionArray[0]?.type === TimeType.TIMESTAMP && parsedExpressionArray[2]?.type === TimeType.TIMESTAMP && parsedExpressionArray[1] === TimeOperator.TO
    ) {
      expressionType = OperationType.POINT_TO_POINT;
    } else if (
      parsedExpressionArray[0]?.type === TimeType.TIMESTAMP && parsedExpressionArray[2]?.type === TimeType.DURATION && parsedExpressionArray[1] !== TimeOperator.TO 
    ) {
      expressionType = OperationType.POINT_AND_DURATION;
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

  // Takes the ms output from TimeMath.evaluate and converts to string value that can be shown to user
  public formatOutput(time: Time): string {
    const { value: timeVal, type } = time;
    if (type === TimeType.DURATION) {
      return this.formatDurationOutput(timeVal);
    }

    return this.formatTimestampOutput(timeVal);
  }

  /*
  * strVal examples: "5hr", "30min", "5hr30min"
  * returns duration in ms
  */
  public getDuration(strVal: string): number {
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

  /*
  * strVal examples: "5:00", "5:00pm"
  * "am/pm" will only be included if is24hrTime === false
  * returns UTC timestamp in ms for the time TODAY.
  */
  // TODO - add support for 'now'
  public getTimestamp(strVal: string): number {
    let isPM = false;
    let timeOnlyStr;
    if (!this.is24hrTime) {
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
    if (hours === 12 && !isPM && !this.is24hrTime) {
      hours = 0;
    }
    const minutes = parseInt(timeStrArray[1]);
    
    const today = new Date(Date.now());
    today.setHours(hours, minutes);
    return today.getTime();
  }

  // TODO - additional validation to ensure that this is a valid timetype
  // ie 04:00:00 - invalid, 5hr5 - invalid, 14:00pm - invalid
  public getTimeType(str: string): TimeType | null {
    if (str.includes(':')) {
      return this.isValidTimestampStr(str) ? TimeType.TIMESTAMP : null;
    }

    if (str.includes('hr') || str.includes('min')) {
      return this.isValidDurationStr(str) ? TimeType.DURATION : null;
    }

    return null;
  }

  public isValidTimestampStr(timeStr: string): boolean {
    if ((timeStr.indexOf('pm') > -1 || timeStr.indexOf('am') > -1) && this.is24hrTime) {
      return false;
    }
  
    // TODO - finish adding other validation
    return true;
  }
  
  public isValidDurationStr(timeStr: string): boolean {
    // TODO - add implementation
    return true;
  }

  public formatDurationOutput(duration: number): string {
    const hours = Math.floor(duration / HOUR);

    const remainder = duration % HOUR;
    const minutes = Math.floor(remainder / MINUTE);

    const hoursSubstr = hours > 0 ? `${hours}hr` : '';
    const minutesSubtr = minutes > 0 ? `${minutes}min` : '';

    if (!(hoursSubstr + minutesSubtr).length) {
      return '0';
    }

    return hoursSubstr + minutesSubtr;
  }

  public formatTimestampOutput(timestamp: number): string {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const minutesStr = minutes < 10 ? '0'.concat(minutes.toString()) : minutes.toString();

    if (this.is24hrTime) {
      return `${hours}:${minutesStr}`;
    }

    let suffix = 'am';
    if (hours > 12) {
      suffix = 'pm';
      hours = hours - 12;
    } else if (hours === 0) {
      hours = 12;
    } else if (hours === 12) {
      suffix = 'pm';
    }
    
    return `${hours}:${minutesStr}${suffix}`;
  }

  private getParsedTime(timeStr: string): Time | null {
    const type = this.getTimeType(timeStr);
    if (type === TimeType.DURATION) {
      return {
        value: this.getDuration(timeStr),
        type,
      }
    }
  
    if (type === TimeType.TIMESTAMP) {
      return {
        value: this.getTimestamp(timeStr),
        type,
      }
    }
  
    return null;
  }
  
  private getParsedOperator(operatorStr: string): TimeOperator | null {
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
}