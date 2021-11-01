import { TimeParser, HOUR, MINUTE, TimeOperator, TimeType, OperationType } from './time-parser';

describe('TimeParser', () => {
  let parser: TimeParser;
  let originalDatenNow: () => number;

  beforeEach(() => {
    originalDatenNow = Date.now;
    Date.now = jest.fn(() => 1635299485596);
    parser = new TimeParser();
  });

  afterEach(() => {
    Date.now = originalDatenNow;
  });

  describe('parseExpression', () => {
    it('correctly parses duration plus duration operation', () => {
      const parsedOperation = parser.parseExpression('5hr + 30min');
      expect(parsedOperation).not.toBeNull();
      if (parsedOperation != null) {
        expect(parsedOperation.type).toBe(OperationType.DURATION_AND_DURATION);
        const [time1, operator, time2] = parsedOperation.expression;
        expect(operator).toBe(TimeOperator.PLUS);
        expect(time1.type).toBe(TimeType.DURATION);
        expect(time1.value).toBe(5 * HOUR);
        expect(time2.type).toBe(TimeType.DURATION);
        expect(time2.value).toBe(30 * MINUTE);
      }
    });

    it('correctly parses duration minus duration operation', () => {
      const parsedOperation = parser.parseExpression('5hr - 30min');
      expect(parsedOperation).not.toBeNull();
      if (parsedOperation != null) {
        expect(parsedOperation.type).toBe(OperationType.DURATION_AND_DURATION);
        const [time1, operator, time2] = parsedOperation.expression;
        expect(operator).toBe(TimeOperator.MINUS);
        expect(time1.type).toBe(TimeType.DURATION);
        expect(time1.value).toBe(5 * HOUR);
        expect(time2.type).toBe(TimeType.DURATION);
        expect(time2.value).toBe(30 * MINUTE);
      }
    });

    it('correctly parses timepoint plus duration operation', () => {
      const parsedOperation = parser.parseExpression('5:15am + 5hr');
      expect(parsedOperation).not.toBeNull();
      if (parsedOperation != null) {
        expect(parsedOperation.type).toBe(OperationType.POINT_AND_DURATION);
        const [time1, operator, time2] = parsedOperation.expression;
        expect(operator).toBe(TimeOperator.PLUS);
        expect(time1.type).toBe(TimeType.TIMESTAMP);
        expect(time1.value).toBe(1635239725596);
        expect(time2.type).toBe(TimeType.DURATION);
        expect(time2.value).toBe(5 * HOUR);
      }
    });

    it('correctly parses timepoint minus duration operation', () => {
      const parsedOperation = parser.parseExpression('5:15am - 5hr');
      expect(parsedOperation).not.toBeNull();
      if (parsedOperation != null) {
        expect(parsedOperation.type).toBe(OperationType.POINT_AND_DURATION);
        const [time1, operator, time2] = parsedOperation.expression;
        expect(operator).toBe(TimeOperator.MINUS);
        expect(time1.type).toBe(TimeType.TIMESTAMP);
        expect(time1.value).toBe(1635239725596);
        expect(time2.type).toBe(TimeType.DURATION);
        expect(time2.value).toBe(5 * HOUR);
      }
    });

    it('correctly parses timepoint to timepoint operation', () => {
      const parsedOperation = parser.parseExpression('5:15am to 5:15pm');
      expect(parsedOperation).not.toBeNull();
      if (parsedOperation != null) {
        expect(parsedOperation.type).toBe(OperationType.POINT_TO_POINT);
        const [time1, operator, time2] = parsedOperation.expression;
        expect(operator).toBe(TimeOperator.TO);
        expect(time1.type).toBe(TimeType.TIMESTAMP);
        expect(time1.value).toBe(1635239725596);
        expect(time2.type).toBe(TimeType.TIMESTAMP);
        expect(time2.value).toBe(1635282925596);
      }
    });
  });

  describe('getDuration', () => {
    it('correctly calculates an hour value', () => {
      const actual = parser.getDuration('5hr');
      expect(actual).toBe(5 * HOUR);
    });

    it('correctly calculates a duration with leading zero', () => {
      const actual = parser.getDuration('05hr');
      expect(actual).toBe(5 * HOUR);
    });

    it('correctly calculates a minutes value', () => {
      const actual = parser.getDuration('30min');
      expect(actual).toBe(30 * MINUTE);
    });

    it('correctly calculates a duration with hours and minutes', () => {
      const actual = parser.getDuration('5hr30min');
      expect(actual).toBe((5 * HOUR) + (30 * MINUTE));
    });

    it('correctly calculates a duration with minutes and hours in that order', () => {
      const actual = parser.getDuration('30min5hr');
      expect(actual).toBe((5 * 60 * 60 * 1000) + (30 * 60 * 1000));
    });
  });

  describe('getTimestamp', () => {
    it('correctly calculates timestamp for "5:15am', () => {
      const actual = parser.getTimestamp("5:15am");
      const expected = 1635239725596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates timestamp for "5:15pm"', () => {
      const actual = parser.getTimestamp("5:15pm");
      const expected = 1635282925596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timestamp for 5:15 - 24hr time', () => {
      parser.set24hrTime(true);
      const actual = parser.getTimestamp("5:15");
      const expected = 1635239725596;
      expect(actual).toBe(expected);
    });

    it('correctly calcualtes the timestamp for 17:15 - 24hr time', () => {
      parser.set24hrTime(true);
      const actual = parser.getTimestamp("17:15");
      const expected = 1635282925596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timstamp for 12:00am', () => {
      const actual = parser.getTimestamp("12:00am");
      const expected = 1635220825596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timestamp for 00:00 - 24hr time', () => {
      parser.set24hrTime(true);
      const actual = parser.getTimestamp("00:00");
      const expected = 1635220825596;
      expect(actual).toBe(expected);
    });
  });

  describe('isValidTimestampStr', () => {
  
  });
  
  describe('isValidDurationStr', () => {
  
  });

  describe('formatDurationOutput', () => {

  });

  describe('formatTimestampOutput', () => {

  });
});

