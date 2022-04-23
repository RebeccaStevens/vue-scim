import type { PathOptions } from "leaflet";
import L from "leaflet";

import * as mapUtils from "../utils";

type Options = L.PolylineOptions & {
  minWeight?: number;
  maxWeight?: number;
};

class PolygonLine extends L.Polyline {
  private readonly weight;

  private readonly minWeight;

  private readonly maxWeight;

  private readonly dashArray;

  public constructor(
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
    options?: Options
  ) {
    const { minWeight, maxWeight, ...opts } = options ?? {};
    if (opts.weight === undefined) {
      opts.weight = 1000;
    }

    super(latlngs, opts);

    this.weight = opts.weight;
    this.minWeight = minWeight ?? 2;
    this.maxWeight = maxWeight ?? Number.POSITIVE_INFINITY;
    this.dashArray =
      typeof opts.dashArray === "string"
        ? opts.dashArray.split(" ").map((v) => Number.parseInt(v, 10))
        : opts.dashArray;
  }

  public onAdd(map: L.Map) {
    L.Polyline.prototype.onAdd.call(this, map);
    map.on("zoomend", this.updateStyle);
    this.updateStyle();
    return this;
  }

  public onRemove(map: L.Map) {
    map.off("zoomend", this.updateStyle);
    L.Polyline.prototype.onRemove.call(this, map);
    return this;
  }

  private updateStyle = () => {
    const updatedStyle = this.getUpdatedStyle();
    this.setStyle(updatedStyle);
  };

  private getUpdatedStyle(): PathOptions {
    const position = [
      mapUtils.unproject(this._map, [0, 0]),
      mapUtils.unproject(this._map, [10_000, 0]),
    ];
    const meterWeight =
      this._map.latLngToContainerPoint(position[1]).x -
      this._map.latLngToContainerPoint(position[0]).x;

    const weight = Math.min(
      Math.max(this.minWeight, (meterWeight * this.weight) / 10_000),
      this.maxWeight
    );

    const dashArray = this.dashArray?.map((v) => (weight * this.weight) / v);

    return {
      weight,
      dashArray,
    };
  }
}

export const polygonLine = (
  latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
  options?: Options
) => new PolygonLine(latlngs, options);
