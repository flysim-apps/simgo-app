import { createSlice } from "@reduxjs/toolkit";

type StateProps = {
  maps: MapsStateProps;
};

type MapsStateProps = {
  plane: FlightRadarProps | null;
};

export type FlightRadarProps = {
  title: string;
  alt: number;
  lat: number;
  lon: number;
  hdg: number;
  spd: string;
};

export const mapsSlice = createSlice({
  name: "maps",
  initialState: {
    plane: null,
  } as MapsStateProps,
  reducers: {
    loadMapData: (state, action) => {
      const { title, alt, lat, lon, hdg, spd } = action.payload;
      state.plane = {
        title,
        alt: Math.round(alt),
        lat,
        lon,
        hdg: Math.round(hdg),
        spd,
      };
    },
  },
});

export const { loadMapData } = mapsSlice.actions;

export const planeData = (state: StateProps) => state.maps.plane;

export default mapsSlice.reducer;
