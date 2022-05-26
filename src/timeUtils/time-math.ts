import { ParsedOperation, ParsedExpression, OperationType, TimeOperator, TimeType, Time, HOUR } from './time-parser';

export class TimeMath {
  static evaluate(operation: ParsedOperation): Time | null {
    switch (operation.type) {
      case OperationType.DURATION_AND_DURATION: {
        const value = this.evaluateDurationAndDuration(operation.expression);
        return value == null ? value : {
          value,
          type: TimeType.DURATION
        };
      }
      case OperationType.POINT_AND_DURATION: {
        const value = this.evaluatePointAndDuration(operation.expression);
        return value == null ? value : {
          value,
          type: TimeType.TIMESTAMP
        };
      }
      case OperationType.POINT_TO_POINT: {
        const value = this.evaluatePointToPoint(operation.expression);
        return value == null ? value : {
          value,
          type: TimeType.DURATION
        };
      }
      default:
        return null;
    }
  }

  // timepoint +/- duration = timepoint
  // Ex: 5:00pm + 2hr = 7:00pm (output UTC timestamp in ms)
  static evaluatePointAndDuration(expresion: ParsedExpression): number | null {
    const [value1, operator, value2] = expresion;
    if (operator === TimeOperator.PLUS) {
      return new Date(value1.value + value2.value).getTime();
    }

    if (operator === TimeOperator.MINUS) {
      return new Date(value1.value - value2.value).getTime();
    }

    return null;
  }

  // duration +/- duration = duration
  // Ex: 5hr + 30min = 5hr30min (output in ms)
  static evaluateDurationAndDuration(expression: ParsedExpression): number | null {
    const [value1, operator, value2] = expression;
    if (operator === TimeOperator.PLUS) return value1.value + value2.value;
    if (operator === TimeOperator.MINUS) return value1.value - value2.value;
    return null;
  }

  // timepoint to timepoint = duration
  // Ex 4:00pm to 5:30pm = 1hr30min (output in ms)
  static evaluatePointToPoint(expression: ParsedExpression): number | null {
    const [value1, operator, value2] = expression;
    if (operator !== TimeOperator.TO) return null;
    if (value2.value >= value1.value) {
      return value2.value - value1.value;
    }
    // if time 2 is earlier than time 1 assume calculating to that time the next day
    // ie 11:00pm to 1:00am = 2hrs NOT -22hrs
    return (24 * HOUR + value2.value) - value1.value;
  }
}