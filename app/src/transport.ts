import { loadMapData } from "features/maps";
import { useDispatch } from "react-redux";
import "whatwg-fetch";

let wsPort = 4050;

if (window.location.hash.indexOf('wsPort') > 0) {
  wsPort = parseInt(window.location.hash.replace(/#wsPort/gi, ''));
  console.warn("WS Port has been overriden: ", wsPort);
}


const connectToSocket = (dispatch: any) => {
  const ws = new WebSocket(
    `${
      process.env.REACT_APP_SOCKET_ADDR?.trim() || "ws://localhost:" + wsPort
    }/socket.io`
  );
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
  ws.onclose = () => {
    console.warn("Web socket reconnect");
    connectToSocket(dispatch);
  };
  return ws;
};

export const useSocket = () => connectToSocket(useDispatch());