import L from "leaflet";

import * as mapUtils from "../utils";

class PolygonLine extends L.Polyline {
  private m_weight = 1000;

  public constructor(
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
    options: L.PolylineOptions | undefined
  ) {
    super(latlngs, options);

    if (options?.weight !== undefined) {
      this.m_weight = options.weight;
    }
  }

  public onAdd(map: L.Map) {
    L.Polyline.prototype.onAdd.call(this, map);
    map.on("zoomend", this.updateWeight);
    this.updateWeight();
    return this;
  }

  public onRemove(map: L.Map) {
    map.off("zoomend", this.updateWeight);
    L.Polyline.prototype.onRemove.call(this, map);
    return this;
  }

  private updateWeight = () => {
    const weight = this.getWeight();

    this.setStyle({
      weight,
    });
  };

  private getWeight() {
    const position = [
      mapUtils.unproject(this._map, [0, 0]),
      mapUtils.unproject(this._map, [10_000, 0]),
    ];
    const meterWeight =
      this._map.latLngToContainerPoint(position[1]).x -
      this._map.latLngToContainerPoint(position[0]).x;

    return Math.max(2, (meterWeight * this.m_weight) / 10_000);
  }
}

export const polygonLine = (
  latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
  options?: L.PolylineOptions
) => new PolygonLine(latlngs, options);
