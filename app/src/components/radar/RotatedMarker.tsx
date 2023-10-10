import React, { forwardRef, useEffect, useRef } from "react";
import { Marker, MarkerProps } from "react-leaflet";
import "leaflet-rotatedmarker";

type RotatedMarkerProps = {
  rotationAngle: number;
  rotationOrigin: string;
  setRotationAngle?: (n: number) => void;
  setRotationOrigin?: (s: string) =>void;
} & MarkerProps;

export const RotatedMarker = forwardRef(
  ({ children, ...props }: RotatedMarkerProps, forwardRef: any) => {
    const markerRef = useRef();

    const { rotationAngle, rotationOrigin } = props;
    useEffect(() => {
      const marker = markerRef.current as any;
      if (marker) {
        marker.setRotationAngle(rotationAngle);
        marker.setRotationOrigin(rotationOrigin);
      }
    }, [rotationAngle, rotationOrigin]);

    return (
      <Marker
        ref={(ref: any) => {
          markerRef.current = ref;
          if (forwardRef) {
            forwardRef.current = ref;
          }
        }}
        {...props}
      >
        {children}
      </Marker>
    );
  }
);
