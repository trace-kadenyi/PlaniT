import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectAccessToken } from "../redux/authSlice";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export function useSocket() {
  const socketRef = useRef(null);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: accessToken },
      withCredentials: true,
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  return socketRef; 
}