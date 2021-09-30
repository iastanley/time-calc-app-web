import * as parser from './expression-parser';

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

});