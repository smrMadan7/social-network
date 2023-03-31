import { createContext, useContext, useReducer } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../constants/AppConstants";

export const SocketContext = createContext({});

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(`Context missing provider`);
  }
  return context;
};

export const SocketContextProvider = ({ children }: any) => {
    const socket: any = io(baseUrl, {
        path: "/notification"
      })
  let initialState: any = {
    socket
  };
  const reducer = (state = initialState, action: any) => {
    return {
      action,
    };
  };

  const [socketContext, setSocketContext] = useReducer(reducer, initialState);
  return <SocketContext.Provider value={{ socketContext, setSocketContext}}>{children}</SocketContext.Provider>;
};
