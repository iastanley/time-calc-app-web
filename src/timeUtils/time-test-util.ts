import { OPERATOR_TOKENS } from './time-parser';

export function getMockDateNowTimestamp(): number {
  return new Date('January 1, 1980, 13:00:00 UTC').getTime();
}

export function convertStrToTokens(str: string): string[] {
  const tokens = [];
  // digits (0-9) or colon (:)
  const digitOrColonRegex = /^\d|:+$/;

  // multicharacter tokens:
  // to
  // now
  // am
  // pm
  // hr
  // min

  let token = '';
  for (let char of str) {
    if (char === ' ') {
      continue;
    }
    if (digitOrColonRegex.test(char) || OPERATOR_TOKENS.includes(char)) {
      tokens.push(char);
      continue;
    }

    token += char;

    if (
      token === 'to' ||
      token === 'now' ||
      token === 'am' ||
      token === 'pm' ||
      token === 'hr' ||
      token === 'min'
    ) {
      tokens.push(token);
      token = '';
    }
  }
  return tokens;
}