export const storeZoom = (zoom: number) => {
  window.localStorage.setItem("RADAR_ZOOM", zoom + "");
};

export const reStoreZoom = () => {
  return parseInt(window.localStorage.getItem("RADAR_ZOOM") || "4");
};

export const storeCenter = (center: any) => {
  window.localStorage.setItem("RADAR_CENTER", JSON.stringify(center));
};

export const reStoreCenter = () => {
  return JSON.parse(
    window.localStorage.getItem("RADAR_CENTER") ||
      JSON.stringify({ lat: 33.7306828, lng: -84.3816473 })
  );
};

export const formatNumber = (v: number) => {
  return new Intl.NumberFormat("en-US").format(Math.round(v));
};
