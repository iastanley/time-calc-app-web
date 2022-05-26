import { TimeMath } from './time-math';
import { TimeParser, MINUTE, HOUR, TimeType } from './time-parser';
import { getMockDateNowTimestamp, convertStrToTokens } from './time-test-util';

describe('TimeMath.evaluate', () => {
  let timeParser: TimeParser;
  let originalDatenNow: () => number;

  beforeEach(() => {
    originalDatenNow = Date.now;
    Date.now = jest.fn(() => getMockDateNowTimestamp());
    timeParser = new TimeParser();
  });

  afterEach(() => {
    Date.now = originalDatenNow;
  });

  it('can evaluate a timepoint plus duration operation', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('5:00pm + 5hr30min'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = 315613800000; // 10:30pm
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.TIMESTAMP);
  });

  it('can evaluate a timepoint minus duration operation', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('5:00pm - 5hr30min'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = 315574200000; // 11:30am
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.TIMESTAMP);
  });

  it('can evaluate a duration plus duration operation', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('45min + 1hr30min'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = (45 * MINUTE) + HOUR + (30 * MINUTE);
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('can evaluate a duration minus duration operation', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('1hr30min - 45min'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = (HOUR + (30 * MINUTE)) - (45 * MINUTE);
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('can evaluate a timepoint to a later timepoint', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('9:00am to 5:00pm'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = 8 * HOUR;
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

  it('if the second timepoint is before the first timepoint evaluates the time to that timepoint on the next day', () => {
    const parsedOperation = timeParser.parseExpression(convertStrToTokens('5:00pm to 4:30pm'));
    const actual = parsedOperation && TimeMath.evaluate(parsedOperation);
    const expected = 23 * HOUR + 30 * MINUTE;
    expect(actual?.value).toBe(expected);
    expect(actual?.type).toBe(TimeType.DURATION);
  });

});
