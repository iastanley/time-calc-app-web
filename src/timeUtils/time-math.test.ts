import { TimeMath } from './time-math';
import { TimeParser, MINUTE, HOUR, TimeType } from './time-parser';
import { getMockDateNowTimestamp } from './time-test-util';

describe('TimeMath.evaluate', () => {
  let timeMath: TimeMath;
  let timeParser: TimeParser;
  let originalDatenNow: () => number;

  beforeEach(() => {
    originalDatenNow = Date.now;
    Date.now = jest.fn(() => getMockDateNowTimestamp());
    timeMath = new TimeMath();
    timeParser = new TimeParser();
  });

  afterEach(() => {
    Date.now = originalDatenNow;
  });

  it('can evaluate a timepoint plus duration operation', () => {
    const parsedOperation = timeParser.parseExpression('5:00pm + 5hr30min');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 315613800000; // 10:30pm
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.TIMESTAMP);
  });

  it('can evaluate a timepoint minus duration operation', () => {
    const parsedOperation = timeParser.parseExpression('5:00pm - 5hr30min');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 315574200000; // 11:30am
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.TIMESTAMP);
  });

  it('can evaluate a duration plus duration operation', () => {
    const parsedOperation = timeParser.parseExpression('45min + 1hr30min');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = (45 * MINUTE) + HOUR + (30 * MINUTE);
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('can evalluate a duration minus duration operation', () => {
    const parsedOperation = timeParser.parseExpression('1hr30min - 45min');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = (HOUR + (30 * MINUTE)) - (45 * MINUTE);
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('can evaluate a timepoint to a later timepoint', () => {
    const parsedOperation = timeParser.parseExpression('9:00am to 5:00pm');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 8 * HOUR;
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('can evaluate a timepoint to an earlier timepoint', () => {
    const parsedOperation = timeParser.parseExpression('5:00pm to 4:30pm');
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = -1 * 30 * MINUTE;
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

});
