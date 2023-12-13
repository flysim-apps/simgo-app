import { loadMapData } from "features/maps";
import { useDispatch } from "react-redux";
import "whatwg-fetch";

let wsPort = 33500;
let connectionOpened = false;

if (window.location.hash.indexOf('wsPort') > 0) {
  wsPort = parseInt(window.location.hash.replace(/#wsPort/gi, ''));
  console.warn("WS Port has been overriden: ", wsPort);
}

export const connectSocket = (dispatch: any) => {
  if (connectionOpened) return;

  const ws = new WebSocket(`${
    process.env.REACT_APP_SOCKET_ADDR?.trim() || "ws://localhost:" + wsPort
  }/socket.io`);

  connectionOpened = true;
  
  ws.onclose = () => {
    console.warn('Web socket reconnect');
    connectSocket(dispatch);
  };

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      
      if (msg.event === "track") {
        dispatch(loadMapData(msg.data));
      }
    } catch (e) {
      console.error("onmessage error: ", e);
    }
  };
}

export const useSocket = () => connectSocket(useDispatch());