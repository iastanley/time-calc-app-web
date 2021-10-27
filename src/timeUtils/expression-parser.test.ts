import * as parser from './expression-parser';
let originalDatenNow: () => number;

describe('expression-parser', () => {
  describe('getDuration', () => {
    it('correctly calculates an hour value', () => {
      const actual = parser.getDuration('5hr');
      expect(actual).toBe(5*60*60*1000);
    });

    it('correctly calculates a duration with leading zero', () => {
      const actual = parser.getDuration('05hr');
      expect(actual).toBe(5 * 60 * 60 * 1000);
    });

    it('correctly calculates a minutes value', () => {
      const actual = parser.getDuration('30min');
      expect(actual).toBe(30 * 60 * 1000);
    });

    it('correctly calculates a duration with hours and minutes', () => {
      const actual = parser.getDuration('5hr30min');
      expect(actual).toBe((5 * 60 * 60 * 1000) + (30 * 60 * 1000));
    });

    it('correctly calculates a duration with minutes and hours in that order', () => {
      const actual = parser.getDuration('30min5hr');
      expect(actual).toBe((5 * 60 * 60 * 1000) + (30 * 60 * 1000));
    });
  });

  describe('getTimestamp', () => {
    beforeEach(() => {
      originalDatenNow = Date.now;
      Date.now = jest.fn(() => 1635299485596);
    });

    afterEach(() => {
      Date.now = originalDatenNow;
    });

    it('correctly calculates timestamp for "5:15am', () => {
      const actual = parser.getTimestamp("5:15am", false);
      const expected = 1635239725596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates timestamp for "5:15pm"', () => {
      const actual = parser.getTimestamp("5:15pm", false);
      const expected = 1635282925596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timestamp for 5:15 - 24hr time', () => {
      const actual = parser.getTimestamp("5:15", true);
      const expected = 1635239725596;
      expect(actual).toBe(expected);
    });

    it('correctly calcualtes the timestamp for 17:15 - 24hr time', () => {
      const actual = parser.getTimestamp("17:15", true);
      const expected = 1635282925596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timstamp for 12:00am', () => {
      const actual = parser.getTimestamp("12:00am", false);
      const expected = 1635220825596;
      expect(actual).toBe(expected);
    });

    it('correctly calculates the timestamp for 00:00 - 24hr time', () => {
      const actual = parser.getTimestamp("00:00", true);
      const expected = 1635220825596;
      expect(actual).toBe(expected);
    });
  });
});