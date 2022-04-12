/**
 * The bounds of the game map.
 */
export type GameBounds = {
  north: number;
  east: number;
  south: number;
  west: number;
};

const nativeSize = 32_768;
const padding = 4096;
export const size = nativeSize + 2 * padding;

const nativeBounds: GameBounds = {
  north: -375_000,
  east: 425_301.832_031,
  south: 375_000,
  west: -324_698.832_031,
};

const nativeWidth = Math.abs(nativeBounds.west) + Math.abs(nativeBounds.east);

const nativeHeight =
  Math.abs(nativeBounds.north) + Math.abs(nativeBounds.south);

export const bounds = (() => {
  const offset = [nativeWidth, nativeHeight].map(
    (dim) => (dim * padding) / nativeSize
  );

  return {
    north: nativeBounds.north - offset[1],
    east: nativeBounds.east + offset[0],
    south: nativeBounds.south + offset[1],
    west: nativeBounds.west - offset[0],
  };
})();

export const width = Math.abs(bounds.west) + Math.abs(bounds.east);
export const height = Math.abs(bounds.north) + Math.abs(bounds.south);

export const centerX = width - bounds.east;
export const centerY = height - bounds.south;
