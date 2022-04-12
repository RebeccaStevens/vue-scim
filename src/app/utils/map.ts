export function getOrCreateMapElement<T>(
  data: Map<string, T>,
  id: string,
  create: () => T
) {
  const existing = data.get(id);
  if (existing !== undefined) {
    return existing;
  }

  const value = create();
  data.set(id, value);
  return value;
}
