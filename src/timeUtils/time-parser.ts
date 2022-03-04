import { digitOnlyRegex } from './regex-util';
import { TimeMath } from './time-math';
import { convertStrToTokens } from './time-test-util';

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
  PLUS = '+',
  MINUS = '-',
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

export const OPERATOR_TOKENS = [
  TimeOperator.TO as string, 
  TimeOperator.PLUS as string, 
  TimeOperator.MINUS as string
];

export function tokenToString(tokens: string[]): string {
  let output = ''
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (OPERATOR_TOKENS.includes(token)) {
      output += ` ${token} `;
    } else {
      output += token;
    }
  }
  return output;
}

export class TimeParser {
  public is24hrTime: boolean;

  constructor(is24hrTime: boolean = false) {
    this.is24hrTime = is24hrTime;
  }

  public set24hrTime(enable: boolean) {
    this.is24hrTime = enable;
  }

  // this is the method used by the view to go from raw token input to string output
  public evaluateExpression(input: string[]): string {
    const parsedExpression = this.parseExpression(input);
    let time;
    let outputStr;
    if (parsedExpression) {
      time = TimeMath.evaluate(parsedExpression);
    }
    if (time) {
      outputStr = this.formatOutput(time);
    }
    return outputStr ?? 'Invalid Input';
  }

  public parseExpression(input: string[]): ParsedOperation | null {
    const parsedExpressionArray: [Time?, TimeOperator?, Time?] = [];
    let expressionArray = this.parseTokens(input);
    if (expressionArray == null) {
      return null;
    }

    const [strVal1, strVal2, strVal3] = expressionArray;
    if (!strVal1 || !strVal2 || !strVal3) {
      return null;
    }
    const parsedTimeValue1 = this.getParsedTime(strVal1);
    const parsedOperator = this.getParsedOperator(strVal2); // TODO - use value directly (maybe)
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
  public getTimestamp(strVal: string): number {
    let isPM = false;
    let timeOnlyStr;
    const today = new Date(Date.now());
    if (strVal === 'now') {
      return today.getTime();
    }

    if (!this.is24hrTime) {
      if (strVal.indexOf('pm') > -1) {
        isPM = true;
      }
      timeOnlyStr = strVal.slice(0, -2); // remove trailing 'am' or 'pm' if is24hrTime === false
    } else {
      timeOnlyStr = strVal;
    }

    const timeStrArray = timeOnlyStr.split(':');
    let hours = parseInt(timeStrArray[0]);
    // Correction needed for 12:xx am -ie 00:xx in 24hr time
    if (hours === 12 && !isPM && !this.is24hrTime) {
      hours = 0;
    }
    // 12:xxpm is the same as 12:xx in 24hr time
    if (hours !== 12 && isPM) {
      hours += 12;
    }
    const minutes = parseInt(timeStrArray[1]);
    
    today.setHours(hours, minutes);
    return today.getTime();
  }

  // TODO - additional validation to ensure that this is a valid timetype
  // ie 04:00:00 - invalid, 5hr5 - invalid, 14:00pm - invalid
  public getTimeType(str: string): TimeType | null {
    if (str.includes(':') || str === 'now') {
      return this.isValidTimestampStr(str) ? TimeType.TIMESTAMP : null;
    }

    if (str.includes('hr') || str.includes('min')) {
      return this.isValidDurationStr(str) ? TimeType.DURATION : null;
    }

    return null;
  }

  public isValidTimestampStr(timeStr: string): boolean {
    const tokens = convertStrToTokens(timeStr); // TODO: refactor to use tokens directly

    if (tokens.length === 1 && tokens[0] === 'now') {
      return true;
    }

    if (tokens.includes('hr') || tokens.includes('min')) {
      return false;
    }

    let hours = '';
    let minutes = '';
    let after = '';
    let addToSection = 'hours';
    let colonCount = 0;
    for (let token of tokens) {
      if (token === ':') {
        addToSection = 'minutes';
        colonCount++;
        continue;
      }
      if (token === 'am' || token === 'pm') {
        addToSection = 'after';
      }
      if (addToSection === 'hours') {
        hours += token;
      }
      if (addToSection === 'minutes') {
        minutes += token;
      }
      if (addToSection === 'after') {
        after += token;
      }
    }

    if (colonCount > 1) {
      return false;
    }
    
    if (hours.length > 2 || hours.length < 1) {
      return false;
    }
    

    if (minutes.length !== 2) {
      return false;
    }
    
    if (this.is24hrTime && after.length > 0) {
      return false;
    }

    if (!this.is24hrTime && (after !== 'am' && after !== 'pm')) {
      return false;
    }

    const hoursToInt = parseInt(hours);
    const minutesToInt = parseInt(minutes);

    if (isNaN(hoursToInt) || isNaN(minutesToInt)) {
      return false;
    }

    if (this.is24hrTime && hoursToInt > 23) {
      return false;
    }

    if (!this.is24hrTime && (hoursToInt > 12 || hoursToInt < 1)) {
      
      return false;
    }

    if (minutesToInt > 59) {
      return false;
    }
  
    return true;
  }
  
  public isValidDurationStr(timeStr: string): boolean {
    const tokens = convertStrToTokens(timeStr); // TODO - use tokens directly

    if (tokens.includes(':')) {
      return false;
    }

    const values = [];
    const units = [];

    let value = '';
    for (let token of tokens) {
      if (token === 'hr' || token === 'min') {
        values.push(value);
        value = '';
        units.push (token);
        continue;
      }

      value += token;
    }

    if (value.length > 0) {
      return false;
    }

    if (values.length > 2) {
      return false;
    }

    for (let val of values) {
      if (isNaN(parseInt(val))) {
        return false;
      }
      // disallow leading zeros in duration values
      if (val.length > 1 && val[0] === '0') {
        return false;
      }
    }

    if (units.length === 2 && (units[0] !== 'hr' || units[1] !== 'min')) {
      return false;
    }

    return true;
  }

  public formatDurationOutput(duration: number): string {
    let negativeSign = '';
    if (duration < 0) {
      negativeSign = '-';
      duration = Math.abs(duration);
    }
    const hours = Math.floor(duration / HOUR);

    const remainder = duration % HOUR;
    const minutes = Math.floor(remainder / MINUTE);

    const hoursSubstr = hours > 0 ? `${hours}hr` : '';
    const minutesSubtr = minutes > 0 ? `${minutes}min` : '';

    if (!(hoursSubstr + minutesSubtr).length) {
      return '0';
    }

    return negativeSign + hoursSubstr + minutesSubtr;
  }

  public formatTimestampOutput(timestamp: number): string {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const minutesStr = minutes < 10 ? '0'.concat(minutes.toString()) : minutes.toString();

    if (this.is24hrTime) {
      const hoursStr = hours < 10 ? '0'.concat(hours.toString()) : hours.toString();
      return `${hoursStr}:${minutesStr}`;
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

  private parseTokens(tokens: string[]): string[] | null {
    const terms = [];
    let currentTerm = '';
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (OPERATOR_TOKENS.includes(token)) {
        terms.push(currentTerm);
        terms.push(token);
        currentTerm = '';
      } else {
        currentTerm += token;
      }
    }
    if (currentTerm.length) {
      terms.push(currentTerm);
    }
    if (terms.length !== 3) {
      return null;
    }
  
    if (!OPERATOR_TOKENS.includes(terms[1])) {
      return null;
    }
  
    return terms;
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