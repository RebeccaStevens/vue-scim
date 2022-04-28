import assert from "assert";

const isProd = import.meta.env.MODE === "production";

// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-empty-function
const noop = () => {};

export const fail: typeof assert.fail = isProd ? (noop as any) : assert.fail;

export const ok: typeof assert.ok = isProd ? (noop as any) : assert.ok;

export const equal: <E>(
  actual: unknown,
  expected: E,
  message?: string | Error
) => asserts actual is E = isProd ? (noop as any) : assert.strictEqual;

export const notEqual: (
  actual: unknown,
  expected: unknown,
  message?: string | Error
) => void = isProd ? (noop as any) : assert.notStrictEqual;

export const deepEqual: <E>(
  actual: unknown,
  expected: E,
  message?: string | Error
) => asserts actual is E = isProd ? (noop as any) : assert.deepStrictEqual;

export const notDeepEqual: (
  actual: unknown,
  expected: unknown,
  message?: string | Error
) => void = isProd ? (noop as any) : assert.notDeepStrictEqual;

export const throws: typeof assert.throws = isProd
  ? (noop as any)
  : assert.throws;

export const doesNotThrow: typeof assert.doesNotThrow = isProd
  ? (noop as any)
  : assert.doesNotThrow;

export const ifError: typeof assert.ifError = isProd
  ? (noop as any)
  : assert.ifError;

export const rejects: typeof assert.rejects = isProd
  ? (noop as any)
  : assert.rejects;

export const doesNotReject: typeof assert.doesNotReject = isProd
  ? (noop as any)
  : assert.doesNotReject;

export const match: typeof assert.match = isProd ? (noop as any) : assert.match;

export const doesNotMatch: typeof assert.doesNotMatch = isProd
  ? (noop as any)
  : assert.doesNotMatch;

/**
 * Tests if the given value is defined.
 *
 * If the values is `undefined` or `null` an `AssertionError` is thrown with `message`.
 */
export function isDefined<E>(
  value: E | null | undefined,
  message?: string
): asserts value is E {
  ok(value !== undefined && value !== null, message);
}
