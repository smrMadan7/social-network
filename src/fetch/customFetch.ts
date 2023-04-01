export const customPost = (params: any, url: string, method: any, setFetchedData: any, purpose: string) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions: any = {
    method: method,
    headers: myHeaders,
    body: JSON.stringify(params),
    redirect: "follow",
  };

  fetch(`${url}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status !== false) {
        setFetchedData(result);
      }
    })
    .catch((error) => {
      console.log(`Error while ${purpose} `, error);
    });
};

export const customGet = (uri: string, setFetchedData: any, purpose: string) => {
  fetch(uri, {})
    .then((response) => response.json())
    .then((result) => {
      if (result.status !== false) {
        setFetchedData(result);
      }
    })
    .catch((error) => {
      console.log(`Erro while ${purpose}`, error);
    });
};

export const getAllProfilesForMention = async (uri: string, setFetchedData: any, purpose: string) => {
  const data = await fetch(uri, { method: "GET" });
  const result = await data.json();
  const output = result?.data.map((data: any) => {
    return {name: data?.organizationName || data?.displayName ,id: data?.address, display: `${data.handle}`, profile: data?.profilePictureUrl };
  });

  return output;
};
