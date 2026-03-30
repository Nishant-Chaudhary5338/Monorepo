import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman, toHex, fromHex, toBinary, fromBinary } from './converters';

describe('toRoman', () => {
  it('converts to roman numerals', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(42)).toBe('XLII');
    expect(toRoman(99)).toBe('XCIX');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });
  it('returns empty for invalid numbers', () => {
    expect(toRoman(0)).toBe('');
    expect(toRoman(-1)).toBe('');
    expect(toRoman(4000)).toBe('');
  });
});

describe('fromRoman', () => {
  it('converts from roman numerals', () => {
    expect(fromRoman('I')).toBe(1);
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('IX')).toBe(9);
    expect(fromRoman('XLII')).toBe(42);
    expect(fromRoman('XCIX')).toBe(99);
    expect(fromRoman('MMMCMXCIX')).toBe(3999);
  });
  it('handles lowercase', () => {
    expect(fromRoman('iv')).toBe(4);
    expect(fromRoman('ix')).toBe(9);
  });
});

describe('toHex', () => {
  it('converts to hex string', () => {
    expect(toHex(255)).toBe('ff');
    expect(toHex(16)).toBe('10');
    expect(toHex(0)).toBe('0');
  });
});

describe('fromHex', () => {
  it('converts from hex string', () => {
    expect(fromHex('ff')).toBe(255);
    expect(fromHex('10')).toBe(16);
    expect(fromHex('0')).toBe(0);
  });
});

describe('toBinary', () => {
  it('converts to binary string', () => {
    expect(toBinary(5)).toBe('101');
    expect(toBinary(255)).toBe('11111111');
    expect(toBinary(0)).toBe('0');
  });
});

describe('fromBinary', () => {
  it('converts from binary string', () => {
    expect(fromBinary('101')).toBe(5);
    expect(fromBinary('11111111')).toBe(255);
    expect(fromBinary('0')).toBe(0);
  });
});
