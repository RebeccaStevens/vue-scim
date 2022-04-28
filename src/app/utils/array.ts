import * as assert from "~/assert";

type Transpose<T extends ReadonlyArray<ReadonlyArray<unknown>>> =
  T extends ReadonlyArray<infer A>
    ? A extends ReadonlyArray<infer B>
      ? B[][]
      : never
    : never;

/**
 * Transpose a 2D array.
 */
export function transpose<T extends ReadonlyArray<ReadonlyArray<unknown>>>(
  value: T
): Transpose<T> {
  assert.ok(value.every((v, i, a) => v.length === a[0].length));

  return (value.length === 0
    ? []
    : value[0].map((_, colIndex) =>
        value.map((row) => row[colIndex])
      )) as unknown as Transpose<T>;
}
