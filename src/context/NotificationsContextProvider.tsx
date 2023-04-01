import { createContext, useContext, useReducer } from "react";

export const NotificationsContext = createContext({});

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(`Context missing provider`);
  }
  return context;
};

export const NotificationContextProvider = ({ children }: any) => {
  let initialState: any = {
    notifications: []
  };
  const reducer = (state = initialState, action: any) => {
    return {
      action,
    };
  };

  const [notifications, setNotifications] = useReducer(reducer, initialState);
  return <NotificationsContext.Provider value={{ notifications, setNotifications}}>{children}</NotificationsContext.Provider>;
};
