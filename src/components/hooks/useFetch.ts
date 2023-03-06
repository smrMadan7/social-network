import { useEffect } from "react";
import { useUserContext } from "../../context/UserContextProvider";

const useFetch = (url: string, method: string, headers: any, body: any, redirect: string) => {
  const { appState, appStatedispatch }: any = useUserContext();

  useEffect(() => {
    var requestOptions: any = {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {});
  }, [url]);
};

export default useFetch;
