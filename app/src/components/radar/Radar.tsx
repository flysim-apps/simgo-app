import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Tooltip } from "react-leaflet";
import { useSelector } from "react-redux";
import { FullscreenControl } from "react-leaflet-fullscreen";
import ContainerDimensions from "react-container-dimensions";
import { planeData } from "features/maps";
import { iconPlane } from "./icons/Plane";
import { RotatedMarker } from "./RotatedMarker";

import "react-leaflet-fullscreen/styles.css";
import "./Radar.module.scss";
import "leaflet-rotatedmarker";
import { Loading } from "components/loading/Loading";
import { reStoreCenter, reStoreZoom, storeCenter, storeZoom } from "./utils";

export const RadarComponent = () => {
  const plane = useSelector(planeData);
  const markers: Array<React.ReactNode> = [];
  const mapRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(reStoreZoom());

  const MapEvents = () => {
    const map = useMapEvents({
      zoomend: () => {
        storeZoom(map.getZoom());
        setZoomLevel(map.getZoom());
      },
      moveend: () => {
        storeCenter(map.getCenter());
      },
    });
    return null;
  };

  const initLatLng = reStoreCenter();

  if (plane) {
      markers.push(
        <RotatedMarker
          key={plane.title}
          position={[plane.lat, plane.lon]}
          icon={iconPlane(zoomLevel)}
          rotationAngle={plane.hdg}
          rotationOrigin="center"
        >
          <Tooltip direction="bottom">
            {plane.title} {plane.hdg}&deg; {Math.round(plane.alt)}ft
          </Tooltip>
        </RotatedMarker>
      );
  }

  return (
    <ContainerDimensions>
      {(props: any) => (
        <MapContainer
          ref={(ref: any) => (mapRef.current = ref)}
          center={[initLatLng.lat, initLatLng.lng]}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          style={{ height: props.height + "px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FullscreenControl />
          <MapEvents />
          {markers}          
          <Loading loading={plane === null} />
        </MapContainer>
      )}
    </ContainerDimensions>
  );
};
