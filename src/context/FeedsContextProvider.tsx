import { createContext, useContext, useReducer } from "react";

export const FeedsContext = createContext({});

export const useFeedsContext = () => {
  const context = useContext(FeedsContext);
  if (context === undefined) {
    throw new Error(`Context missing provider`);
  }
  return context;
};

export const FeedsContextProvider = ({ children }: any) => {
  let initialState: any = {};
  const reducer = (state = initialState, action: any) => {
    return {
      action,
    };
  };

  const [feeds, setFeeds] = useReducer(reducer, initialState);
  return <FeedsContext.Provider value={{ feeds, setFeeds }}>{children}</FeedsContext.Provider>;
};
