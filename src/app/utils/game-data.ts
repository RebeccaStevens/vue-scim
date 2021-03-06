export function getResourcePurityId(resource: string, purity: string) {
  const purityCapitalize = purity.charAt(0).toUpperCase() + purity.slice(1);
  return `${resource}${purityCapitalize}`;
}

export function getPOIsId(group: string, type: string, purity?: string) {
  return `${
    purity !== undefined ? getResourcePurityId(type, purity) : type
  }-${group}`;
}
