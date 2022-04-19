type ImageSrcs = ReadonlyArray<{
  src: string;
  size: number;
  format: string;
}>;

export function createSrcSet(images: ImageSrcs) {
  return Object.values(images)
    .map((image) => `${image.src} ${image.size}w`)
    .join(", ");
}
