/**
 * The bounds of the game map.
 */
export type GameBounds = Readonly<{
  north: number;
  east: number;
  south: number;
  west: number;
}>;

export const bounds: GameBounds = {
  north: -375_000,
  east: 425_302,
  south: 375_000,
  west: -324_699,
};

export const width = Math.abs(bounds.west) + Math.abs(bounds.east);
export const height = Math.abs(bounds.north) + Math.abs(bounds.south);

export const centerX = width - bounds.east;
export const centerY = height - bounds.south;
