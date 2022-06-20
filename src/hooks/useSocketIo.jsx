import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Hook to create socket connection
const useSocketIo = (room) => {
  const [socketIo, setSocketIo] = useState(null);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_IPADRESS, {
      transports: ["websocket"],
    });

    setSocketIo(socket);
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("room", room);
    });
    socket.on("connect_error", (error) => {
      console.log(error.message);
      setTimeout(() => socket.connect(), 4000);
    });

    socket.on("disconnect", () => console.log("disconnected"));

    return () => socket.disconnect();
  }, []);

  return socketIo;
};

export default useSocketIo;
