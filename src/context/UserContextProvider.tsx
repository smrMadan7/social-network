import { createContext, useContext, useReducer } from "react";

export const UserContext = createContext({});

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(`Context missing provider`);
  }
  return context;
};

export const UserContextProvider = ({ children }: any) => {
  let initialState: any = {};

  const reducer = (state = initialState, action: any) => {
    return {
      action,
    };
  };

  const [appState, appStatedispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ appState, appStatedispatch }}>{children}</UserContext.Provider>
  );
};
