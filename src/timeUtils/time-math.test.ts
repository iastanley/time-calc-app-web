import { TimeMath } from './time-math';
import { parseExpression, MINUTE, HOUR } from './expression-parser';
let originalDatenNow: () => number;

describe('TimeMath.evaluate', () => {
  let timeMath: TimeMath;
  beforeEach(() => {
    originalDatenNow = Date.now;
    Date.now = jest.fn(() => 1635299485596);
    timeMath = new TimeMath();
  });

  afterEach(() => {
    Date.now = originalDatenNow;
  });

  it('can evaluate a timepoint plus duration operation', () => {
    const parsedOperation = parseExpression('5:00pm + 5hr30min', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 1635301825596;
    expect(actual).toBe(expected);
  });

  it('can evaluate a timepoint minus duration operation', () => {
    const parsedOperation = parseExpression('5:00pm - 5hr30min', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 1635262225596;
    expect(actual).toBe(expected);
  });

  it('can evaluate a duration plus duration operation', () => {
    const parsedOperation = parseExpression('45min + 1hr30min', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = (45 * MINUTE) + HOUR + (30 * MINUTE);
    expect(actual).toBe(expected);
  });

  it('can evalluate a duration minus duration operation', () => {
    const parsedOperation = parseExpression('1hr30min - 45min', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = (HOUR + (30 * MINUTE)) - (45 * MINUTE);
    expect(actual).toBe(expected);
  });

  it('can evaluate a timepoint to a later timepoint', () => {
    const parsedOperation = parseExpression('9:00am to 5:00pm', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = 8 * HOUR;
    expect(actual).toBe(expected);
  });

  it('can evaluate a timepoint to an earlier timepoint', () => {
    const parsedOperation = parseExpression('5:00pm to 4:30pm', false);
    const actual = parsedOperation && timeMath.evaluate(parsedOperation);
    const expected = -1 * 30 * MINUTE;
    expect(actual).toBe(expected);
  });

});
