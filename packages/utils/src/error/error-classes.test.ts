import { describe, it, expect } from 'vitest';
import { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError, NetworkError, TimeoutError } from './error-classes';

describe('AppError', () => {
  it('creates error with defaults', () => {
    const err = new AppError('Something went wrong');
    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe('UNKNOWN_ERROR');
    expect(err.status).toBe(500);
    expect(err.name).toBe('AppError');
  });
  it('creates error with custom values', () => {
    const err = new AppError('Bad', 'BAD_REQUEST', 400, { field: 'email' });
    expect(err.code).toBe('BAD_REQUEST');
    expect(err.status).toBe(400);
    expect(err.details).toEqual({ field: 'email' });
  });
  it('serializes to JSON', () => {
    const err = new AppError('Test', 'TEST', 400);
    const json = err.toJSON();
    expect(json.name).toBe('AppError');
    expect(json.message).toBe('Test');
    expect(json.code).toBe('TEST');
    expect(json.status).toBe(400);
  });
});

describe('ValidationError', () => {
  it('has correct defaults', () => {
    const err = new ValidationError('Invalid field');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.status).toBe(422);
    expect(err.name).toBe('ValidationError');
  });
});

describe('AuthenticationError', () => {
  it('has correct defaults', () => {
    const err = new AuthenticationError();
    expect(err.code).toBe('AUTH_REQUIRED');
    expect(err.status).toBe(401);
    expect(err.name).toBe('AuthenticationError');
  });
});

describe('AuthorizationError', () => {
  it('has correct defaults', () => {
    const err = new AuthorizationError();
    expect(err.code).toBe('FORBIDDEN');
    expect(err.status).toBe(403);
    expect(err.name).toBe('AuthorizationError');
  });
});

describe('NotFoundError', () => {
  it('has correct defaults', () => {
    const err = new NotFoundError();
    expect(err.code).toBe('NOT_FOUND');
    expect(err.status).toBe(404);
    expect(err.name).toBe('NotFoundError');
  });
});

describe('ConflictError', () => {
  it('has correct defaults', () => {
    const err = new ConflictError();
    expect(err.code).toBe('CONFLICT');
    expect(err.status).toBe(409);
    expect(err.name).toBe('ConflictError');
  });
});

describe('RateLimitError', () => {
  it('has correct defaults', () => {
    const err = new RateLimitError();
    expect(err.code).toBe('RATE_LIMITED');
    expect(err.status).toBe(429);
    expect(err.name).toBe('RateLimitError');
  });
});

describe('NetworkError', () => {
  it('has correct defaults', () => {
    const err = new NetworkError();
    expect(err.code).toBe('NETWORK_ERROR');
    expect(err.status).toBe(0);
    expect(err.name).toBe('NetworkError');
  });
});

describe('TimeoutError', () => {
  it('has correct defaults', () => {
    const err = new TimeoutError();
    expect(err.code).toBe('TIMEOUT_ERROR');
    expect(err.status).toBe(408);
    expect(err.name).toBe('TimeoutError');
  });
});
