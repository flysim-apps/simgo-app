import L from "leaflet";
import marker from "assets/icons/plane.svg";

export const iconPlane = (zoom: number) => {
  let point = new L.Point(24, 24);
  if (zoom > 4 && zoom <= 6) {
    point = new L.Point(32, 32);
  } else if (zoom > 6 && zoom < 9) {
    point = new L.Point(42, 42);
  } else if (zoom >= 9) {
    point = new L.Point(64, 64);
  }
  return new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconSize: point,
  });
};
