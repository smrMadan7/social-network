import { memo } from "react";
import { FaThList } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import EmptyPost from "../components/Cards/EmptyPost";
import Post from "../components/Cards/Post";
import { useFeedsContext } from "../context/FeedsContextProvider";
import { useUserContext } from "../context/UserContextProvider";
import { useState, useEffect } from "react"
import { customGet } from "../fetch/customFetch";
import { getFeeds } from "../constants/AppConstants";
import { useLocation } from "react-router";

const PostContainer = memo((props: any) => {
  const { feeds, setFeeds }: any = useFeedsContext();
  const { appState }: any = useUserContext();
  const [allFeeds, setAllFeeds] = useState<any>();
  const [fetchedFeeds, setFetchedFeeds] = useState<any>();


  const location = useLocation();


  // useEffect(() => {
  //   if (location?.search?.includes("?goto=")) {
  //     const element: any = document.getElementById("6301bf27-cdb8-43fc-9662-9e43a1398569");
  //     element?.scrollIntoView({ behavior: "smooth" });

  //   }

  // }, [location])


  useEffect(() => {
    if (props?.mode === "liked" ) {
      getAllFeeds();
    }

  }, [props?.mode]);
  
  useEffect(() => {
    if (fetchedFeeds?.staus) {
      setAllFeeds(fetchedFeeds?.data);
      const feeds = fetchedFeeds?.data;
      setFeeds({
        feeds,
      });
    }
  }, [fetchedFeeds]);

  const getAllFeeds = async () => {
    customGet(`${getFeeds}${appState?.action?.user?.address}`, setFetchedFeeds, "getting all feeds");
  };



  return (
    <div className="border rounded-lg">
      {props?.posts?.length === 0 && props?.mode === "timeline" ? (
        <>
          <EmptyPost content={"You haven't posted anything yet!"} />
        </>
      ) : (
        <>
          {
            props?.mode === "timeline" ?
              (
                <div className=" mb-9 md:mb-2">
                  {props?.posts?.map((post: any, index: any) => {
                    return (
                      <div key={uuidv4()}>
                        <Post post={post} />
                      </div>
                    );
                  })}
                </div>

              ) : (
                <div className=" mb-9 md:mb-2">
                  {
                    feeds.action?.feeds.length === 0 ?
                      (
                        <>
                          <EmptyPost content={"You haven't liked anything yet!"} />
                        </>
                      ) : (

                        <>
                          {feeds?.action?.feeds?.map((post: any, index: any) => {
                            if (post?.likes?.includes(appState?.action?.user?.address)) {
                              return (
                                <div key={uuidv4()}>
                                  <Post post={post} />
                                </div>
                              );
                            }

                          })}
                        </>
                      )
                  }

                </div>

              )
          }
        </>

      )}
    </div>
  );
});

export default PostContainer;
