import { useEffect, memo, useRef, useState } from "react";
import {
  useGetConfigQuery,
  useGetFollowedPostsQuery,
  useGetPostsQuery,
  useGetUserShareQuery,
} from "./services/homeApi";
import Player from "./components/Player";
import loader from "./vod_loader.gif";

import VideoSidebar from "./components/VideoSidebar";
import "./home.css";
import VideoFooter from "./components/VideoFooter";
import Top20Movies from "./components/Top20Movies";
import TopNavbar from "./components/TopNavbar";
import Explorer from "../explore/Explore";

import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "./services/homeSlice";
import { setCurrentActivePost } from "./services/activeSlice";
import { setVideos } from "./services/videosSlice";
import { setPage } from "./services/pageSlice";
import HeartCount from "./components/Heart";
import VideoContainer from "./components/VideoContainer";
import Ads from "./components/Ads";
import { setBottomLoader } from "./services/loaderSlice";
import ShowHeartCom from "./components/ShowHeartCom";
import {
  appendVideosToRender,
  setVideosToRender,
} from "./services/videoRenderSlice";
import { setStart } from "./services/startSlice";
import CircleCountDown from "./components/CircleCountDown";
import CountdownCircle from "./components/CountdownCircle";
// import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { decryptImage } from "@/utils/imageDecrypt";
import { useLayoutEffect } from "react";

const Home = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  // const [videos, setVideos] = useState<any[]>([]);
  //const [page, setPage] = useState(1);
  const { currentActivePost } = useSelector((state: any) => state.activeslice);

  const { videos } = useSelector((state: any) => state.videoSlice);
  const { start } = useSelector((state: any) => state.startSlice);
  // const { videosToRender } = useSelector(
  //   (state: any) => state.videoRenderSlice
  // );
  const { page } = useSelector((state: any) => state.pageSlice);

  // const { data, isLoading } = useGetUserShareQuery({
  //   type: "video",
  //   id: post?.post_id,
  //   qr_code: 1,
  // });

  // const user1 = useSelector((state: any) => state?.persist?.user) || "";
  // const { data: profile, refetch: refetchUser } = useGetMyOwnProfileQuery("", {
  //   skip: !user1,
  // });

  //const [currentActivePost, setCurrentActivePost] = useState<any>(null); // Active post ID

  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const currentTab = useSelector((state: any) => state.home.currentTab);
  //const user = useSelector((state: any) => state?.persist?.profileData);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
  // const [start, setStart] = useState(false);
  const abortControllerRef = useRef<AbortController[]>([]); // Array to store AbortControllers
  const videoData = useRef<any[]>([]); // Array to store AbortControllers
  const indexRef = useRef(0); // Track the current active video index
  const [showHeart, setShowHeart] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // const [currentTab, setCurrentTab] = useState(2);
  const swiperRef = useRef<any>(null);

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

  const { data: config } = useGetConfigQuery({});
  // const user = profile?.data;

  // Fetch data based on the current tab
  const {
    data: followData,
    isFetching: isFollowFetching,
    refetch: followRefetch,
    isError: followError,
  } = useGetFollowedPostsQuery(
    {
      page,
    },
    { skip: currentTab !== 0 }
  );

  const {
    data: forYouData,
    isFetching: isForYouFetching,
    refetch: forYouRefetch,
    isError: ForyouError,
  } = useGetPostsQuery(
    {
      page,
    },
    { skip: currentTab !== 2 }
  );

  const isLoading =
    (currentTab === 0 && isFollowFetching) ||
    (currentTab === 2 && isForYouFetching);

  const isError = ForyouError || followError;

  // Add at the top of your Home component
  const decryptionCache = useRef(new Map<string, string>());

  // Add this utility function inside your Home component
  const decryptThumbnail = async (thumbnail: string): Promise<string> => {
    if (!thumbnail) return "";

    // Check cache first
    if (decryptionCache.current.has(thumbnail)) {
      return decryptionCache.current.get(thumbnail) || "";
    }

    // If it's not a .txt file, cache and return as-is
    if (!thumbnail.endsWith(".txt")) {
      decryptionCache.current.set(thumbnail, thumbnail);
      return thumbnail;
    }

    try {
      const decryptedUrl = await decryptImage(thumbnail);
      decryptionCache.current.set(thumbnail, decryptedUrl);
      return decryptedUrl;
    } catch (error) {
      console.error("Error decrypting thumbnail:", error);
      return "";
    }
  };

  useEffect(() => {
    // Determine which data corresponds to the current tab
    const currentData =
      currentTab === 0 ? followData : currentTab === 2 ? forYouData : null; // Add other tabs if necessary

    if (currentData?.data) {
      // Determine the key in the videos object based on the current tab
      const videoKey =
        currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : "";

      // Filter out posts with duplicate `post_id`
      const filteredData = currentData?.data?.filter(
        (newPost: any) =>
          !videos[videoKey]?.some(
            (video: any) => video?.post_id === newPost?.post_id
          )
      );

      if (page === 1) {
        setIsDecrypting(true);
      }

      if (filteredData?.length > 0) {
        try {
          const decryptAndUpdateVideos = async () => {
            const decryptedVideos = await Promise.all(
              filteredData.map(async (video: any) => ({
                ...video,
                decryptedPreview: await decryptThumbnail(video.preview_image),
              }))
            );

            if (page === 1) {
              // Replace videos for the current tab
              dispatch(
                setVideos({
                  ...videos,
                  [videoKey]: decryptedVideos,
                })
              );
            } else {
              // Append decrypted videos for the current tab
              dispatch(
                setVideos({
                  ...videos,
                  [videoKey]: [...videos[videoKey], ...decryptedVideos],
                })
              );
            }
            setIsDecrypting(false);
          };
          decryptAndUpdateVideos();
        } catch (error) {
        } finally {
        }
      } else {
        setIsDecrypting(false);
      }
    }
  }, [followData, forYouData, currentTab, page]);

  useEffect(() => {
    const container = videoContainerRef.current;

    if (container && currentActivePost) {
      // Ensure currentActivePost is a string and trim spaces
      const activeElement = container.querySelector(
        `[data-post-id="${currentActivePost.trim()}"]`
      );

      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" });
      } else {
        console.warn("Element with data-post-id not found!");
      }
    }
  }, []); // Add currentActivePost as a dependency

  useLayoutEffect(() => {
    const container = videoContainerRef.current;

    if (!container) return; // Ensure the container is available before proceeding.

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(setPage(page + 1)); // Load more videos
          }
        });
      },
      {
        rootMargin: "100px", // Trigger the observer when 100px from the bottom
        threshold: 0.5, // 50% visibility of the last video
      }
    );

    // Ensure videos are available
    const currentVideos = videos[currentTab === 2 ? "foryou" : "follow"];
    if (currentVideos.length > 1) {
      const secondLastVideo = container.children[container.children.length - 5];
      if (secondLastVideo) {
        observer.observe(secondLastVideo);
      }
    }

    // Cleanup observer on component unmount or when dependencies change
    return () => {
      observer.disconnect();
    };
  }, [videos[currentTab === 2 ? "foryou" : "follow"], refresh]); // Dependencies (excluding videoContainerRef.current as it's stable)

  if (topmovies) {
    return <Top20Movies setTopMovies={setTopMovies} />;
  }

  useEffect(() => {
    if (refresh) {
      const fetchData = async () => {
        if (currentTab === 2) {
          await forYouRefetch();
        } else if (currentTab === 0) {
          await followRefetch();
        }

        const videoKey =
          currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
        dispatch(
          setVideos({
            ...videos,
            [videoKey]: [], // Append to the current tab
          })
        );

        const currentData =
          currentTab === 0 ? followData : currentTab === 2 ? forYouData : null; // Add other tabs if necessary

        const container = videoContainerRef.current;
        if (container && currentData?.data[0]?.post_id) {
          const activeElement = container.querySelector(
            `[data-post-id="${currentData?.data[0]?.post_id}"]`
          );
          if (activeElement) {
            activeElement.scrollIntoView({ block: "center" });
          }
        }

        setRefresh(false);
      };
      fetchData();
    }
  }, [refresh]);

  const handleTabClick = (tab: number) => {
    dispatch(setPage(1));
    dispatch(setCurrentActivePost(null));
    dispatch(
      setVideos({
        follow: [],
        foryou: [],
      })
    );
    if (currentTab !== tab) {
      dispatch(setCurrentTab(tab));

      // setCurrentTab(tab); // Update the current tab

      // dispatch(setVideos([]));

      //setVideos([]);

      // // Update the Swiper active index
      // if (swiperRef.current) {
      //   swiperRef.current.slideTo(tab); // Change the Swiper index to match the clicked tab
      // }
    } else {
      // const videoKey =
      //   currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
      // dispatch(
      //   setVideos({
      //     ...videos,
      //     [videoKey]: [], // Append to the current tab
      //   })
      // );
      dispatch(setStart(false));

      setRefresh(true);
    }
  };

  // Track the currently visible video and update currentActivePost
  useLayoutEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");
            if (postId && postId !== currentActivePost) {
              dispatch(setCurrentActivePost(postId)); // Update the active post ID in Redux
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Trigger when 60% of the video is visible
      }
    );

    // Observe all video elements
    const videoElements = container.querySelectorAll(".video");
    videoElements.forEach((video) => observer.observe(video));

    // Cleanup observer on unmount or when videos change
    return () => {
      observer.disconnect();
    };
  }, [videos[currentTab === 2 ? "foryou" : "follow"], currentTab, dispatch]);

  const handleRefresh = () => {
    const videoKey =
      currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
    dispatch(setPage(1));
    dispatch(setCurrentActivePost(null));
    dispatch(setStart(false));

    dispatch(
      setVideos({
        ...videos,
        [videoKey]: [], // Append to the current tab
      })
    );
    if (currentTab === 2) {
      forYouRefetch();
    } else if (currentTab === 0) {
      followRefetch();
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[1024px] home-main w-full">
        <TopNavbar currentTab={currentTab} onTabClick={handleTabClick} />

        <div className="app bg-[#16131C]">
          {isDecrypting && (
            <div className="app bg-[#16131C]">
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <div className="heart">
                  <img
                    src={loader}
                    className="w-[100px] h-[100px]"
                    alt="Loading"
                  />
                </div>
              </div>
            </div>
          )}
          {refresh ? (
            <div className="bg-[#232323] rounded-xl px-4 py-0">
              <img src={loader} alt="" width={50} height={50} />
            </div>
          ) : (
            <>
              {currentTab === 0 &&
                (isLoading && videos["follow"] === 0 ? (
                  <div className="app bg-[#16131C]">
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <div className="heart">
                        <img
                          src={loader}
                          className="w-[100px] h-[100px]"
                          alt="Loading"
                        />
                      </div>
                    </div>
                  </div>
                ) : !isError ? (
                  <>
                    <div
                      ref={videoContainerRef}
                      className={`app__videos pb-[80px] `}
                    >
                      {videos["follow"]?.map((video: any, index: any) => (
                        <div
                          key={index}
                          className="video mt-[20px]"
                          data-post-id={video?.post_id} // Add post ID to the container
                        >
                          {video?.file_type !== "video" ? (
                            <a href={video?.ads_info?.jump_url} target="_blank">
                              <img
                                src={video?.files[0]?.resourceURL}
                                alt=""
                                className="h-full w-full"
                              />
                            </a>
                          ) : (
                            <VideoContainer
                              // refetchUser={refetchUser}
                              videoData={videoData}
                              indexRef={indexRef}
                              abortControllerRef={abortControllerRef}
                              container={videoContainerRef.current}
                              status={true}
                              countNumber={countNumber}
                              video={video}
                              // coin={user?.coins}
                              setCountNumber={setCountNumber}
                              config={config}
                              countdown={countdown}
                              setWidth={setWidth}
                              setHeight={setHeight}
                              setHearts={setHearts}
                              setCountdown={setCountdown}
                              width={width}
                              height={height}
                              // setShowHeart={setShowHeart}
                            />
                          )}

                          {video?.type !== "ads" &&
                            video?.type !== "ads_virtual" && (
                              <VideoFooter
                                badge={video?.user?.badge}
                                id={video?.user?.id}
                                tags={video?.tag}
                                title={video?.title}
                                username={video?.user?.name}
                                city={video?.city}
                              />
                            )}

                          {(video?.type === "ads" ||
                            video?.type === "ads_virtual") && (
                            <Ads ads={video?.ads_info} type={video?.type} />
                          )}

                          {hearts.map((id: any) => (
                            <HeartCount id={id} key={id} remove={removeHeart} />
                          ))}

                          {/* {showHeart && (
                            <ShowHeartCom
                              countNumber={countNumber}
                              nickname={user?.nickname}
                              photo={user?.profile_photo}
                            />
                          )}
                          {showHeart && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999]">
                              <CountdownCircle countNumber={countNumber} />
                            </div>
                          )} */}
                        </div>
                      ))}
                    </div>

                    {(!followData?.data?.length ||
                      !forYouData?.data?.length) && (
                      <p style={{ textAlign: "center" }}>
                        {/* <b>You have seen all videos</b> */}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="app bg-[#16131C]">
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <div className="text-white flex flex-col justify-center items-center  gap-2">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="none"
                          >
                            <path
                              d="M24.4993 28.7502C24.4993 25.9212 23.3755 23.2081 21.3752 21.2077C19.3748 19.2073 16.6617 18.0835 13.8327 18.0835C11.0037 18.0835 8.2906 19.2073 6.29021 21.2077C4.28982 23.2081 3.16602 25.9212 3.16602 28.7502"
                              stroke="#888888"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M13.8327 18.0833C17.5146 18.0833 20.4993 15.0986 20.4993 11.4167C20.4993 7.73477 17.5146 4.75 13.8327 4.75C10.1508 4.75 7.16602 7.73477 7.16602 11.4167C7.16602 15.0986 10.1508 18.0833 13.8327 18.0833Z"
                              stroke="#888888"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M29.8337 27.4164C29.8337 22.9231 27.1671 18.7498 24.5004 16.7498C25.3769 16.0921 26.0779 15.2286 26.5411 14.2355C27.0044 13.2424 27.2157 12.1504 27.1564 11.0562C27.0971 9.96195 26.7689 8.89922 26.201 7.96204C25.6331 7.02486 24.8429 6.24212 23.9004 5.68311"
                              stroke="#888888"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="follow-error">关注您喜欢的作者</div>
                      </div>
                    </div>
                  </div>
                ))}

              {currentTab == 1 && (
                <div className="w-screen">
                  <Explorer />
                </div>
              )}

              {currentTab == 2 &&
                (isLoading && videos["foryou"]?.length === 0 ? (
                  <div className="app bg-[#16131C]">
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <div className="heart">
                        <img
                          src={loader}
                          className="w-[100px] h-[100px]"
                          alt="Loading"
                        />
                      </div>
                    </div>
                  </div>
                ) : !isError ? (
                  <>
                    <div
                      ref={videoContainerRef}
                      className={`app__videos pb-[80px]`}
                    >
                      {videos["foryou"]?.map((video: any, index: any) => (
                        <div
                          key={index}
                          className="video mt-[20px]"
                          data-post-id={video.post_id} // Add post ID to the container
                        >
                          {video?.file_type !== "video" ? (
                            <a href={video?.ads_info?.jump_url} target="_blank">
                              <img
                                src={video?.files[0]?.resourceURL}
                                alt=""
                                className="h-full w-full"
                              />
                            </a>
                          ) : (
                            <VideoContainer
                              // refetchUser={refetchUser}
                              videoData={videoData}
                              indexRef={indexRef}
                              abortControllerRef={abortControllerRef}
                              container={videoContainerRef.current}
                              status={true}
                              countNumber={countNumber}
                              video={video}
                              // coin={user?.coins}
                              setCountNumber={setCountNumber}
                              config={config}
                              countdown={countdown}
                              setWidth={setWidth}
                              setHeight={setHeight}
                              setHearts={setHearts}
                              setCountdown={setCountdown}
                              width={width}
                              height={height}
                              // setShowHeart={setShowHeart}
                            />
                          )}

                          {video?.type !== "ads" &&
                            video?.type !== "ads_virtual" && (
                              <VideoFooter
                                badge={video?.user?.badge}
                                id={video?.user?.id}
                                tags={video?.tag}
                                title={video?.title}
                                username={video?.user?.name}
                                city={video?.city}
                              />
                            )}

                          {(video?.type === "ads" ||
                            video?.type === "ads_virtual") && (
                            <Ads ads={video?.ads_info} type={video?.type} />
                          )}
                          {/*
                          {video?.type === "ads" && (
                            <Ads ads={video?.ads_info} />
                          )} */}

                          {hearts.map((id: any) => (
                            <HeartCount id={id} key={id} remove={removeHeart} />
                          ))}

                          {/* {showHeart && (
                            <ShowHeartCom
                              countNumber={countNumber}
                              nickname={user?.nickname}
                              photo={user?.profile_photo}
                            />
                          )}

                          {showHeart && (
                            <div className="absolute bottom-[300px] right-[70px] transform z-[999]">
                              <CountdownCircle countNumber={countNumber} />
                            </div>
                          )} */}
                        </div>
                      ))}
                    </div>

                    {(!followData?.data?.length ||
                      !forYouData?.data?.length) && (
                      <p style={{ textAlign: "center" }}>
                        {/* <b>You have seen all videos</b> */}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="app bg-[#16131C]">
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <div className="text-white flex flex-col justify-center items-center  gap-2">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="33"
                            viewBox="0 0 32 33"
                            fill="none"
                          >
                            <path
                              d="M11.4031 4.62095L11.403 4.62082C14.0022 3.54025 16.8802 3.35193 19.5939 4.08509C22.3076 4.81823 24.7089 6.43272 26.4261 8.68014L26.4263 8.68032C26.4937 8.76877 26.5718 8.84833 26.6556 8.91565L27.2033 9.35581L26.5006 9.36052L21.7383 9.39246C20.9726 9.39847 20.3567 10.0226 20.3627 10.7872L20.3627 10.7877C20.3672 11.5526 20.9924 12.1689 21.7575 12.1629L21.7578 12.1629L29.9185 12.1079L29.9188 12.1079M11.4031 4.62095L31.5441 10.6738C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095C8.80635 5.69987 6.62978 7.61268 5.21499 10.066C3.80005 12.5178 3.22479 15.3727 3.57938 18.1896C3.93397 21.0065 5.19865 23.6248 7.17475 25.6426L7.17484 25.6426C9.15302 27.6604 11.732 28.9637 14.5143 29.3547C17.2967 29.7475 20.1293 29.2043 22.578 27.8108L22.5781 27.8107C25.0249 26.417 26.9521 24.2493 28.0576 21.6402C28.3569 20.9349 29.1703 20.6058 29.8752 20.905L29.8755 20.905C30.5785 21.2025 30.9079 22.0155 30.6087 22.7208L30.6086 22.7209C29.2671 25.888 26.9264 28.5235 23.9488 30.2193C20.9694 31.9151 17.5185 32.5769 14.1274 32.0984L14.1273 32.0984C10.7378 31.6215 7.59926 30.0339 5.19598 27.5819C2.79267 25.1299 1.25895 21.9508 0.829223 18.5357C0.399503 15.1204 1.09649 11.6584 2.81532 8.68015L2.81534 8.68011C4.53244 5.70358 7.17669 3.37559 10.341 2.06238L10.3411 2.06233C13.5054 0.747344 17.01 0.518603 20.3157 1.41094M11.4031 4.62095L31.2942 10.6809C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095L31.2942 10.6809M29.9188 12.1079C30.2921 12.1048 30.648 11.9527 30.9061 11.6842C31.165 11.4147 31.3048 11.0538 31.2942 10.6809M29.9188 12.1079L31.2942 10.6809M31.2942 10.6809L31.0405 2.09452C31.0179 1.33093 30.3788 0.728074 29.6155 0.750614L29.6155 0.750615C28.8505 0.773158 28.2491 1.41193 28.2716 2.17735L28.2716 2.1774L28.3834 5.99257L28.4037 6.68592L27.9458 6.16495C25.9267 3.8682 23.2757 2.21083 20.3157 1.41094M20.3157 1.41094C20.3157 1.41095 20.3157 1.41095 20.3157 1.41096L20.3809 1.16961L20.3157 1.41094ZM20.1127 10.7892C20.118 11.6924 20.8562 12.42 21.7594 12.4129L21.7364 9.14247C20.8331 9.14956 20.1056 9.88598 20.1127 10.7892Z"
                              fill="white"
                              stroke="#16131C"
                              stroke-width="0.5"
                            />
                          </svg>
                        </div>
                        <div className=" text-white">
                          网络连接失败，点击重试
                        </div>
                        <div className="follow-error">加载失败，请稍后重试</div>
                        <button
                          onClick={handleRefresh}
                          className="refreshBtn px-5 py-1"
                        >
                          重试
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Home);

// import { useEffect, memo, useRef, useState } from "react";
// import { useSwipeable } from "react-swipeable";
// import {
//   useGetConfigQuery,
//   useGetFollowedPostsQuery,
//   useGetPostsQuery,
// } from "./services/homeApi";
// import loader from "./vod_loader.gif";
// import VideoFooter from "./components/VideoFooter";
// import Top20Movies from "./components/Top20Movies";
// import TopNavbar from "./components/TopNavbar";
// import Explorer from "../explore/Explore";
// import { useDispatch, useSelector } from "react-redux";
// import { setCurrentTab } from "./services/homeSlice";
// import { setCurrentActivePost } from "./services/activeSlice";
// import { setVideos } from "./services/videosSlice";
// import { setPage } from "./services/pageSlice";
// import HeartCount from "./components/Heart";
// import VideoContainer from "./components/VideoContainer";
// import Ads from "./components/Ads";
// import { decryptImage } from "@/utils/imageDecrypt";
// import { useLayoutEffect } from "react";

// const Home = () => {
//   const videoContainerRef = useRef<HTMLDivElement>(null);
//   const { currentActivePost } = useSelector((state: any) => state.activeslice);
//   const { videos } = useSelector((state: any) => state.videoSlice);
//   const { page } = useSelector((state: any) => state.pageSlice);

//   const [countdown, setCountdown] = useState(3);
//   const [countNumber, setCountNumber] = useState(0);
//   const [topmovies, setTopMovies] = useState(false);
//   const currentTab = useSelector((state: any) => state.home.currentTab);
//   const [refresh, setRefresh] = useState(false);
//   const dispatch = useDispatch();
//   const [hearts, setHearts] = useState<number[]>([]);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   const abortControllerRef = useRef<AbortController[]>([]);
//   const videoData = useRef<any[]>([]);
//   const indexRef = useRef(0);
//   const [isDecrypting, setIsDecrypting] = useState(false);
//   //const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [isSwiping, setIsSwiping] = useState(false);

//   const {
//     data: config,
//     isLoading: isConfigLoading,
//     isError: isConfigError,
//   } = useGetConfigQuery({});
//   const {
//     data: followData,
//     isFetching: isFollowFetching,
//     refetch: followRefetch,
//     isError: followError,
//   } = useGetFollowedPostsQuery({ page }, { skip: currentTab !== 0 });
//   const {
//     data: forYouData,
//     isFetching: isForYouFetching,
//     refetch: forYouRefetch,
//     isError: forYouError,
//   } = useGetPostsQuery({ page }, { skip: currentTab !== 2 });

//   const isLoading =
//     isConfigLoading ||
//     (currentTab === 0 && isFollowFetching) ||
//     (currentTab === 2 && isForYouFetching);
//   const isError = isConfigError || followError || forYouError;

//   const [videoIndices, setVideoIndices] = useState({
//     follow: 0,
//     foryou: 0,
//   });

//   // Get current video index based on active tab
//   const currentVideoIndex =
//     videoIndices[currentTab === 2 ? "foryou" : "follow"];
//   const currentVideos = videos[currentTab === 2 ? "foryou" : "follow"] || [];
//   const currentVideo = currentVideos[currentVideoIndex] || null;

//   // Update video index handler
//   const setCurrentVideoIndex = (index: number) => {
//     setVideoIndices((prev) => ({
//       ...prev,
//       [currentTab === 2 ? "foryou" : "follow"]: index,
//     }));
//   };

//   const decryptionCache = useRef(new Map<string, string>());

//   const decryptThumbnail = async (thumbnail: string): Promise<string> => {
//     if (!thumbnail) return "";
//     if (decryptionCache.current.has(thumbnail))
//       return decryptionCache.current.get(thumbnail) || "";
//     if (!thumbnail.endsWith(".txt")) {
//       decryptionCache.current.set(thumbnail, thumbnail);
//       return thumbnail;
//     }
//     try {
//       const decryptedUrl = await decryptImage(thumbnail);
//       decryptionCache.current.set(thumbnail, decryptedUrl);
//       return decryptedUrl;
//     } catch (error) {
//       console.error("Error decrypting thumbnail:", error);
//       return "";
//     }
//   };

//   useEffect(() => {
//     const currentData =
//       currentTab === 0 ? followData : currentTab === 2 ? forYouData : null;
//     if (currentData?.data) {
//       const videoKey =
//         currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : "";
//       const filteredData = currentData.data.filter(
//         (newPost: any) =>
//           !videos[videoKey]?.some(
//             (video: any) => video?.post_id === newPost?.post_id
//           )
//       );

//       if (page === 1) setIsDecrypting(true);

//       if (filteredData?.length > 0) {
//         const decryptAndUpdateVideos = async () => {
//           const decryptedVideos = await Promise.all(
//             filteredData.map(async (video: any) => ({
//               ...video,
//               decryptedPreview: await decryptThumbnail(video.preview_image),
//             }))
//           );

//           if (page === 1) {
//             dispatch(setVideos({ ...videos, [videoKey]: decryptedVideos }));
//           } else {
//             dispatch(
//               setVideos({
//                 ...videos,
//                 [videoKey]: [...videos[videoKey], ...decryptedVideos],
//               })
//             );
//           }
//           setIsDecrypting(false);
//         };
//         decryptAndUpdateVideos();
//       } else {
//         setIsDecrypting(false);
//       }
//     }
//   }, [followData, forYouData, currentTab, page]);

//   const handlers = useSwipeable({
//     onSwipedUp: () => {
//       if (currentVideoIndex < currentVideos.length - 1) {
//         setIsSwiping(true);
//         setCurrentVideoIndex(currentVideoIndex + 1);
//         setTimeout(() => setIsSwiping(false), 300);
//       }
//     },
//     onSwipedDown: () => {
//       if (currentVideoIndex > 0) {
//         setIsSwiping(true);
//         setCurrentVideoIndex(currentVideoIndex - 1);
//         setTimeout(() => setIsSwiping(false), 300);
//       }
//     },
//     preventDefaultTouchmoveEvent: true,
//     trackMouse: true,
//     delta: 60, // Minimum distance of 60px
//     swipeDuration: 500, // Max 500ms duration
//     touchEventOptions: { passive: false },
//     trackTouch: true,
//   });

//   // Update current active post when index changes
//   useEffect(() => {
//     if (currentVideo) {
//       dispatch(setCurrentActivePost(currentVideo.post_id));
//     }
//   }, [currentVideoIndex, currentVideo]);

//   useEffect(() => {
//     if (currentActivePost) {
//       // Find the index of the video with matching post_id
//       const foundIndex = currentVideos.findIndex(
//         (video: any) => video.post_id === currentActivePost
//       );

//       // Only update if the index was found and it's different from current index
//       if (foundIndex !== -1 && foundIndex !== currentVideoIndex) {
//         setCurrentVideoIndex(foundIndex);

//         // setCurrentVideo(currentVideos[foundIndex]);
//       }
//     }
//   }, []);

//   // Handle keyboard arrow keys
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowUp" && currentVideoIndex > 0) {
//         setCurrentVideoIndex(currentVideoIndex - 1);
//       } else if (
//         e.key === "ArrowDown" &&
//         currentVideoIndex < currentVideos.length - 1
//       ) {
//         setCurrentVideoIndex(currentVideoIndex + 1);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentVideoIndex, currentVideos.length]);

//   // Load more videos when nearing the end
//   useEffect(() => {
//     if (
//       currentVideoIndex >= currentVideos.length - 3 &&
//       !isLoading &&
//       currentVideos.length > 0
//     ) {
//       dispatch(setPage(page + 1));
//     }
//   }, [currentVideoIndex, currentVideos.length, isLoading]);

//   const handleTabClick = (tab: number) => {
//     if (currentTab !== tab) {
//       dispatch(setCurrentTab(tab));
//     } else {
//       setRefresh(true);
//     }
//   };

//   const handleRefresh = () => {
//     const videoKey = currentTab === 2 ? "foryou" : "follow";
//     dispatch(setPage(1));
//     dispatch(setCurrentActivePost(null));
//     dispatch(setVideos({ ...videos, [videoKey]: [] }));
//     if (currentTab === 2) forYouRefetch();
//     else if (currentTab === 0) followRefetch();
//     setCurrentVideoIndex(0);
//   };

//   const removeHeart = (id: number) => {
//     setHearts((prev) => prev.filter((heartId) => heartId !== id));
//   };

//   if (topmovies) {
//     return <Top20Movies setTopMovies={setTopMovies} />;
//   }

//   return (
//     <div className="flex justify-center items-center">
//       <div className="max-w-[1024px] home-main w-full">
//         <TopNavbar currentTab={currentTab} onTabClick={handleTabClick} />

//         <div className="app bg-[#16131C]">
//           {isDecrypting && (
//             <div className="app bg-[#16131C]">
//               <div style={{ textAlign: "center", padding: "20px" }}>
//                 <div className="heart">
//                   <img
//                     src={loader}
//                     className="w-[100px] h-[100px]"
//                     alt="Loading"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {refresh ? (
//             <div className="bg-[#232323] rounded-xl px-4 py-0">
//               <img src={loader} alt="" width={50} height={50} />
//             </div>
//           ) : (
//             <>
//               {currentTab === 0 &&
//                 (isLoading && currentVideos.length === 0 ? (
//                   <div className="app bg-[#16131C]">
//                     <div style={{ textAlign: "center", padding: "20px" }}>
//                       <div className="heart">
//                         <img
//                           src={loader}
//                           className="w-[100px] h-[100px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   !isError &&
//                   currentVideo && (
//                     <div
//                       {...handlers}
//                       className="app__videos pb-[80px] h-screen overflow-hidden relative"
//                     >
//                       <div
//                         className={`video-container ${
//                           isSwiping ? "swipe-transition" : ""
//                         }`}
//                         style={{
//                           transform: `translateY(-${
//                             currentVideoIndex * 100
//                           }vh)`,
//                           transition: isSwiping
//                             ? "transform 0.5s ease-out"
//                             : "none",
//                         }}
//                       >
//                         <div
//                           className="video mt-[20px] h-screen"
//                           data-post-id={currentVideo?.post_id}
//                           style={{
//                             transform: `translateY(${
//                               currentVideoIndex * 100
//                             }vh)`,
//                             transition: isSwiping
//                               ? "transform 1s ease-in"
//                               : "none",
//                           }}
//                         >
//                           <a
//                             className={
//                               currentVideo?.file_type !== "video"
//                                 ? ""
//                                 : "hidden"
//                             }
//                             href={currentVideo?.ads_info?.jump_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <img
//                               src={currentVideo?.files[0]?.resourceURL}
//                               alt=""
//                               className="h-full w-full object-cover"
//                             />
//                           </a>
//                           <div
//                             className={`${
//                               currentVideo?.file_type !== "video"
//                                 ? "hidden"
//                                 : ""
//                             } w-full h-full object-fill`}
//                           >
//                             <VideoContainer
//                               videoData={videoData}
//                               indexRef={indexRef}
//                               abortControllerRef={abortControllerRef}
//                               container={videoContainerRef.current}
//                               status={true}
//                               countNumber={countNumber}
//                               video={currentVideo}
//                               setCountNumber={setCountNumber}
//                               config={config}
//                               countdown={countdown}
//                               setWidth={setWidth}
//                               setHeight={setHeight}
//                               setHearts={setHearts}
//                               setCountdown={setCountdown}
//                               width={width}
//                               height={height}
//                             />
//                           </div>

//                           {currentVideo?.type !== "ads" &&
//                             currentVideo?.type !== "ads_virtual" && (
//                               <VideoFooter
//                                 badge={currentVideo?.user?.badge}
//                                 id={currentVideo?.user?.id}
//                                 tags={currentVideo?.tag}
//                                 title={currentVideo?.title}
//                                 username={currentVideo?.user?.name}
//                                 city={currentVideo?.city}
//                               />
//                             )}

//                           {(currentVideo?.type === "ads" ||
//                             currentVideo?.type === "ads_virtual") && (
//                             <Ads
//                               ads={currentVideo?.ads_info}
//                               type={currentVideo?.type}
//                             />
//                           )}

//                           {hearts.map((id: any) => (
//                             <HeartCount id={id} key={id} remove={removeHeart} />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 ))}

//               {isError && (
//                 <div className="app bg-[#16131C]">
//                   <div style={{ textAlign: "center", padding: "20px" }}>
//                     <div className="text-white flex flex-col justify-center items-center gap-2">
//                       <div>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="33"
//                           height="33"
//                           viewBox="0 0 33 33"
//                           fill="none"
//                         >
//                           <path
//                             d="M24.4993 28.7502C24.4993 25.9212 23.3755 23.2081 21.3752 21.2077C19.3748 19.2073 16.6617 18.0835 13.8327 18.0835C11.0037 18.0835 8.2906 19.2073 6.29021 21.2077C4.28982 23.2081 3.16602 25.9212 3.16602 28.7502"
//                             stroke="#888888"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M13.8327 18.0833C17.5146 18.0833 20.4993 15.0986 20.4993 11.4167C20.4993 7.73477 17.5146 4.75 13.8327 4.75C10.1508 4.75 7.16602 7.73477 7.16602 11.4167C7.16602 15.0986 10.1508 18.0833 13.8327 18.0833Z"
//                             stroke="#888888"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                       <div className="follow-error">关注您喜欢的作者</div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {currentTab === 1 && (
//                 <div className="w-screen">
//                   <Explorer />
//                 </div>
//               )}

//               {currentTab === 2 &&
//                 (isLoading && currentVideos.length === 0 ? (
//                   <div className="app bg-[#16131C]">
//                     <div style={{ textAlign: "center", padding: "20px" }}>
//                       <div className="heart">
//                         <img
//                           src={loader}
//                           className="w-[100px] h-[100px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   !isError &&
//                   currentVideo && (
//                     <div
//                       {...handlers}
//                       className="app__videos pb-[80px] h-screen overflow-hidden relative"
//                     >
//                       <div
//                         className={`video-container ${
//                           isSwiping ? "swipe-transition" : ""
//                         }`}
//                         style={{
//                           transform: `translateY(-${
//                             currentVideoIndex * 100
//                           }vh)`,
//                           transition: isSwiping
//                             ? "transform 0.5s ease-out"
//                             : "none",
//                         }}
//                       >
//                         <div
//                           className="video mt-[20px] h-screen"
//                           data-post-id={currentVideo?.post_id}
//                           style={{
//                             transform: `translateY(${
//                               currentVideoIndex * 100
//                             }vh)`,
//                             transition: isSwiping
//                               ? "transform 1s ease-in"
//                               : "none",
//                           }}
//                         >
//                           <a
//                             className={
//                               currentVideo?.file_type !== "video"
//                                 ? ""
//                                 : "hidden"
//                             }
//                             href={currentVideo?.ads_info?.jump_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <img
//                               src={currentVideo?.files[0]?.resourceURL}
//                               alt=""
//                               className="h-full w-full object-cover"
//                             />
//                           </a>
//                           <div
//                             className={`${
//                               currentVideo?.file_type !== "video"
//                                 ? "hidden"
//                                 : ""
//                             } w-full h-full object-fill`}
//                           >
//                             <VideoContainer
//                               videoData={videoData}
//                               indexRef={indexRef}
//                               abortControllerRef={abortControllerRef}
//                               container={videoContainerRef.current}
//                               status={true}
//                               countNumber={countNumber}
//                               video={currentVideo}
//                               setCountNumber={setCountNumber}
//                               config={config}
//                               countdown={countdown}
//                               setWidth={setWidth}
//                               setHeight={setHeight}
//                               setHearts={setHearts}
//                               setCountdown={setCountdown}
//                               width={width}
//                               height={height}
//                             />
//                           </div>

//                           {currentVideo?.type !== "ads" &&
//                             currentVideo?.type !== "ads_virtual" && (
//                               <VideoFooter
//                                 badge={currentVideo?.user?.badge}
//                                 id={currentVideo?.user?.id}
//                                 tags={currentVideo?.tag}
//                                 title={currentVideo?.title}
//                                 username={currentVideo?.user?.name}
//                                 city={currentVideo?.city}
//                               />
//                             )}

//                           {(currentVideo?.type === "ads" ||
//                             currentVideo?.type === "ads_virtual") && (
//                             <Ads
//                               ads={currentVideo?.ads_info}
//                               type={currentVideo?.type}
//                             />
//                           )}

//                           {hearts.map((id: any) => (
//                             <HeartCount id={id} key={id} remove={removeHeart} />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               {isError && (
//                 <div className="app bg-[#16131C]">
//                   <div style={{ textAlign: "center", padding: "20px" }}>
//                     <div className="text-white flex flex-col justify-center items-center gap-2">
//                       <div>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="32"
//                           height="33"
//                           viewBox="0 0 32 33"
//                           fill="none"
//                         >
//                           <path
//                             d="M11.4031 4.62095L11.403 4.62082C14.0022 3.54025 16.8802 3.35193 19.5939 4.08509C22.3076 4.81823 24.7089 6.43272 26.4261 8.68014L26.4263 8.68032C26.4937 8.76877 26.5718 8.84833 26.6556 8.91565L27.2033 9.35581L26.5006 9.36052L21.7383 9.39246C20.9726 9.39847 20.3567 10.0226 20.3627 10.7872L20.3627 10.7877C20.3672 11.5526 20.9924 12.1689 21.7575 12.1629L21.7578 12.1629L29.9185 12.1079L29.9188 12.1079M11.4031 4.62095L31.5441 10.6738C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095C8.80635 5.69987 6.62978 7.61268 5.21499 10.066C3.80005 12.5178 3.22479 15.3727 3.57938 18.1896C3.93397 21.0065 5.19865 23.6248 7.17475 25.6426L7.17484 25.6426C9.15302 27.6604 11.732 28.9637 14.5143 29.3547C17.2967 29.7475 20.1293 29.2043 22.578 27.8108L22.5781 27.8107C25.0249 26.417 26.9521 24.2493 28.0576 21.6402C28.3569 20.9349 29.1703 20.6058 29.8752 20.905L29.8755 20.905C30.5785 21.2025 30.9079 22.0155 30.6087 22.7208L30.6086 22.7209C29.2671 25.888 26.9264 28.5235 23.9488 30.2193C20.9694 31.9151 17.5185 32.5769 14.1274 32.0984L14.1273 32.0984C10.7378 31.6215 7.59926 30.0339 5.19598 27.5819C2.79267 25.1299 1.25895 21.9508 0.829223 18.5357C0.399503 15.1204 1.09649 11.6584 2.81532 8.68015L2.81534 8.68011C4.53244 5.70358 7.17669 3.37559 10.341 2.06238L10.3411 2.06233C13.5054 0.747344 17.01 0.518603 20.3157 1.41094M11.4031 4.62095L31.2942 10.6809C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095L31.2942 10.6809M29.9188 12.1079C30.2921 12.1048 30.648 11.9527 30.9061 11.6842C31.165 11.4147 31.3048 11.0538 31.2942 10.6809M29.9188 12.1079L31.2942 10.6809M31.2942 10.6809L31.0405 2.09452C31.0179 1.33093 30.3788 0.728074 29.6155 0.750614L29.6155 0.750615C28.8505 0.773158 28.2491 1.41193 28.2716 2.17735L28.2716 2.1774L28.3834 5.99257L28.4037 6.68592L27.9458 6.16495C25.9267 3.8682 23.2757 2.21083 20.3157 1.41094M20.3157 1.41094C20.3157 1.41095 20.3157 1.41095 20.3157 1.41096L20.3809 1.16961L20.3157 1.41094ZM20.1127 10.7892C20.118 11.6924 20.8562 12.42 21.7594 12.4129L21.7364 9.14247C20.8331 9.14956 20.1056 9.88598 20.1127 10.7892Z"
//                             fill="white"
//                             stroke="#16131C"
//                             strokeWidth="0.5"
//                           />
//                         </svg>
//                       </div>
//                       <div className="text-white">网络连接失败，点击重试</div>
//                       <div className="follow-error">加载失败，请稍后重试</div>
//                       <button
//                         onClick={handleRefresh}
//                         className="refreshBtn px-5 py-1"
//                       >
//                         重试
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(Home);

// import { useEffect, memo, useRef, useState } from "react";
// import {
//   useGetConfigQuery,
//   useGetFollowedPostsQuery,
//   useGetPostsQuery,
// } from "./services/homeApi";
// import Player from "./components/Player";
// import loader from "./vod_loader.gif";

// import VideoSidebar from "./components/VideoSidebar";
// import "./home.css";
// import VideoFooter from "./components/VideoFooter";
// import Top20Movies from "./components/Top20Movies";
// import TopNavbar from "./components/TopNavbar";
// import Explorer from "../explore/Explore";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCurrentTab } from "./services/homeSlice";
// import { setCurrentActivePost } from "./services/activeSlice";
// import { setVideos } from "./services/videosSlice";
// import { setPage } from "./services/pageSlice";
// import HeartCount from "./components/Heart";
// import VideoContainer from "./components/VideoContainer";
// import Ads from "./components/Ads";
// import { setBottomLoader } from "./services/loaderSlice";
// import ShowHeartCom from "./components/ShowHeartCom";
// import {
//   appendVideosToRender,
//   setVideosToRender,
// } from "./services/videoRenderSlice";
// import { setStart } from "./services/startSlice";
// import CircleCountDown from "./components/CircleCountDown";
// import CountdownCircle from "./components/CountdownCircle";
// // import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
// import { decryptImage } from "@/utils/imageDecrypt";

// const Home = () => {
//   const videoContainerRef = useRef<HTMLDivElement>(null);
//   // const [videos, setVideos] = useState<any[]>([]);
//   //const [page, setPage] = useState(1);
//   const { currentActivePost } = useSelector((state: any) => state.activeslice);

//   const { videos } = useSelector((state: any) => state.videoSlice);
//   const { start } = useSelector((state: any) => state.startSlice);
//   const { videosToRender } = useSelector(
//     (state: any) => state.videoRenderSlice
//   );
//   const { page } = useSelector((state: any) => state.pageSlice);

//   // const user1 = useSelector((state: any) => state?.persist?.user) || "";
//   // const { data: profile, refetch: refetchUser } = useGetMyOwnProfileQuery("", {
//   //   skip: !user1,
//   // });

//   //const [currentActivePost, setCurrentActivePost] = useState<any>(null); // Active post ID

//   const [countdown, setCountdown] = useState(3);
//   const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
//   const [topmovies, setTopMovies] = useState(false);
//   const currentTab = useSelector((state: any) => state.home.currentTab);
//   //const user = useSelector((state: any) => state?.persist?.profileData);
//   const [refresh, setRefresh] = useState(false);
//   const dispatch = useDispatch();
//   const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   // const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
//   const [videosPerLoad, setVideosPerLoad] = useState(3); // Number of videos to initially render
//   // const [start, setStart] = useState(false);
//   const abortControllerRef = useRef<AbortController[]>([]); // Array to store AbortControllers
//   const videoData = useRef<any[]>([]); // Array to store AbortControllers
//   const indexRef = useRef(0); // Track the current active video index
//   const [showHeart, setShowHeart] = useState(false);

//   // const [currentTab, setCurrentTab] = useState(2);
//   const swiperRef = useRef<any>(null);

//   const removeHeart = (id: number) => {
//     setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
//   };

//   const { data: config } = useGetConfigQuery({});
//   // const user = profile?.data;

//   // Fetch data based on the current tab
//   const {
//     data: followData,
//     isFetching: isFollowFetching,
//     refetch: followRefetch,
//     isError: followError,
//   } = useGetFollowedPostsQuery(
//     {
//       page,
//     },
//     { skip: currentTab !== 0 }
//   );

//   const {
//     data: forYouData,
//     isFetching: isForYouFetching,
//     refetch: forYouRefetch,
//     isError: ForyouError,
//   } = useGetPostsQuery(
//     {
//       page,
//     },
//     { skip: currentTab !== 2 }
//   );

//   const isLoading =
//     (currentTab === 0 && isFollowFetching) ||
//     (currentTab === 2 && isForYouFetching);

//   const isError = ForyouError || followError;

//   useEffect(() => {
//     const initialVideos =
//       videos[
//         currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : ""
//       ]?.slice(0, videosPerLoad) || [];
//     console.log(initialVideos);
//     setVideosToRender(initialVideos);
//   }, [videos, videosPerLoad]);

//   // Add at the top of your Home component
//   const decryptionCache = useRef(new Map<string, string>());

//   // Add this utility function inside your Home component
//   const decryptThumbnail = async (thumbnail: string): Promise<string> => {
//     if (!thumbnail) return "";

//     // Check cache first
//     if (decryptionCache.current.has(thumbnail)) {
//       return decryptionCache.current.get(thumbnail) || "";
//     }

//     // If it's not a .txt file, cache and return as-is
//     if (!thumbnail.endsWith(".txt")) {
//       decryptionCache.current.set(thumbnail, thumbnail);
//       return thumbnail;
//     }

//     try {
//       const decryptedUrl = await decryptImage(thumbnail);
//       decryptionCache.current.set(thumbnail, decryptedUrl);
//       return decryptedUrl;
//     } catch (error) {
//       console.error("Error decrypting thumbnail:", error);
//       return "";
//     }
//   };

//   useEffect(() => {
//     const prepareInitialVideos = async () => {
//       if (!start) {
//         const initialVideos =
//           videos[
//             currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : ""
//           ]?.slice(0, videosPerLoad) || [];

//         if (initialVideos.length > 1) {
//           const videosWithDecryptedPreviews = await Promise.all(
//             initialVideos.map(async (video: any) => ({
//               ...video,
//               decryptedPreview: await decryptThumbnail(video.preview_image),
//             }))
//           );

//           dispatch(setVideosToRender(videosWithDecryptedPreviews));
//           dispatch(setStart(true));
//         }
//       }
//     };

//     prepareInitialVideos();
//   }, [videos]);

//   // useEffect(() => {
//   //   if (!start) {
//   //     const initialVideos =
//   //       videos[
//   //         currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : ""
//   //       ]?.slice(0, videosPerLoad) || [];

//   //     if (initialVideos.length > 1) {
//   //       dispatch(setVideosToRender(initialVideos));
//   //       dispatch(setStart(true));
//   //     }
//   //   }
//   // }, [videos]); // Runs only once on mount

//   useEffect(() => {
//     // Determine which data corresponds to the current tab
//     const currentData =
//       currentTab === 0 ? followData : currentTab === 2 ? forYouData : null; // Add other tabs if necessary

//     if (currentData?.data) {
//       // Determine the key in the videos object based on the current tab
//       const videoKey =
//         currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : "";

//       // Filter out posts with duplicate `post_id`
//       const filteredData = currentData?.data?.filter(
//         (newPost: any) =>
//           !videos[videoKey]?.some(
//             (video: any) => video?.post_id === newPost?.post_id
//           )
//       );
//       console.log(currentData?.data);

//       if (filteredData?.length > 0) {
//         if (page === 1) {
//           // Replace videos for the current tab
//           dispatch(
//             setVideos({
//               ...videos,
//               [videoKey]: filteredData, // Update only the current tab
//             })
//           );
//         } else {
//           // Append filtered videos for the current tab
//           dispatch(
//             setVideos({
//               ...videos,
//               [videoKey]: [...videos[videoKey], ...filteredData], // Append to the current tab
//             })
//           );
//         }
//       } else {
//         // console.log("No new videos to add");
//       }
//     }
//   }, [followData, forYouData, currentTab, page]);

//   // // Scroll to the first current post when the component is mounted
//   // useEffect(() => {
//   //   const container = videoContainerRef.current;

//   //   if (container && currentActivePost) {
//   //     console.log("c", container);
//   //     console.log("d", currentActivePost);
//   //     const activeElement = container.querySelector(
//   //       `[data-post-id="${currentActivePost}"]`
//   //     );
//   //     console.log("winuahdhhcah", activeElement);
//   //     if (activeElement) {
//   //       activeElement.scrollIntoView({ block: "center" });
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     const container = videoContainerRef.current;

//     if (container && currentActivePost) {
//       // Ensure currentActivePost is a string and trim spaces
//       const activeElement = container.querySelector(
//         `[data-post-id="${currentActivePost.trim()}"]`
//       );

//       if (activeElement) {
//         activeElement.scrollIntoView({ block: "center" });
//       } else {
//         console.warn("Element with data-post-id not found!");
//       }
//     }
//   }, []); // Add currentActivePost as a dependency

//   useEffect(() => {
//     const container = videoContainerRef.current;
//     if (!container) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // Get the post ID of the intersecting video
//             const postId = entry.target.getAttribute("data-post-id");

//             // Check if the intersecting video is one of the last five videos in the `videos["foryou"]` list
//             const forYouVideos = videos[currentTab === 2 ? "foryou" : "follow"];
//             const lastFiveVideos = forYouVideos.slice(-5); // Get the last five videos
//             console.log(forYouVideos);
//             console.log(postId);
//             console.log(lastFiveVideos);

//             if (lastFiveVideos[0].post_id === postId) {
//               console.log("winn");
//               dispatch(setPage(page + 1)); // Load more videos
//             }
//           }
//         });
//       },
//       {
//         rootMargin: "100px", // Trigger the observer when 100px from the bottom
//         threshold: 0.5, // 50% visibility of the video
//       }
//     );

//     // Observe all video elements
//     Array.from(container.children).forEach((child) => {
//       observer.observe(child);
//     });

//     // Cleanup observer on component unmount or when dependencies change
//     return () => {
//       observer.disconnect();
//     };
//   }, [videosToRender, refresh]);

//   // useEffect(() => {
//   //   const container = videoContainerRef.current;
//   //   if (!container) return;

//   //   const observer = new IntersectionObserver(
//   //     (entries) => {
//   //       entries.forEach((entry) => {
//   //         if (entry.isIntersecting) {
//   //           dispatch(setPage(page + 1)); // Load more videos
//   //         }
//   //       });
//   //     },
//   //     {
//   //       rootMargin: "100px", // Trigger the observer when 100px from the bottom
//   //       threshold: 0.5, // 50% visibility of the last video
//   //     }
//   //   );

//   //   // Observe the last video element
//   //   if (videosToRender.length > 5) {
//   //     const secondLastVideo = container.children[container.children.length - 5];
//   //     if (secondLastVideo) {
//   //       observer.observe(secondLastVideo);
//   //     }
//   //   }

//   //   // Cleanup observer on component unmount or when dependencies change
//   //   return () => {
//   //     observer.disconnect();
//   //   };
//   // }, [videosToRender, refresh]);

//   if (topmovies) {
//     return <Top20Movies setTopMovies={setTopMovies} />;
//   }

//   useEffect(() => {
//     const container = videoContainerRef.current;
//     if (!container) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(async (entry) => {
//           if (entry.isIntersecting) {
//             const lastFiveVideos =
//               videos[
//                 currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : ""
//               ]?.slice(videosToRender?.length, videosToRender?.length + 3) ||
//               [];
//             if (lastFiveVideos.length > 0) {
//               const videosWithDecryptedPreviews = await Promise.all(
//                 lastFiveVideos.map(async (video: any) => ({
//                   ...video,
//                   decryptedPreview: await decryptThumbnail(video.preview_image),
//                 }))
//               );

//               dispatch(appendVideosToRender(videosWithDecryptedPreviews));
//             }
//             //  dispatch(appendVideosToRender(lastFiveVideos));
//           }
//         });
//       },
//       {
//         rootMargin: "100px", // Trigger the observer when 100px from the bottom
//         threshold: 0.5, // 50% visibility of the last video
//       }
//     );

//     // Observe the last video element
//     if (videosToRender.length > 1) {
//       const secondLastVideo = container.children[container.children.length - 2];
//       if (secondLastVideo) {
//         observer.observe(secondLastVideo);
//       }
//     }
//     // Cleanup observer on component unmount or when dependencies change
//     return () => {
//       observer.disconnect();
//     };
//   }, [videosToRender, refresh]);

//   // const handleSlideChange = (swiper: any) => {
//   //   const newTab = swiper.activeIndex; // Get the active slide index
//   //   if (currentTab !== newTab) {
//   //     dispatch(setCurrentTab(newTab));
//   //     // setCurrentTab(newTab); // Update the current tab
//   //     setPage(1);
//   //     setVideos([]);
//   //   }
//   // };

//   useEffect(() => {
//     if (refresh) {
//       const fetchData = async () => {
//         if (currentTab === 2) {
//           await forYouRefetch();
//         } else if (currentTab === 0) {
//           await followRefetch();
//         }

//         const videoKey =
//           currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
//         dispatch(
//           setVideos({
//             ...videos,
//             [videoKey]: [], // Append to the current tab
//           })
//         );

//         const currentData =
//           currentTab === 0 ? followData : currentTab === 2 ? forYouData : null; // Add other tabs if necessary

//         const container = videoContainerRef.current;
//         if (container && currentData?.data[0]?.post_id) {
//           const activeElement = container.querySelector(
//             `[data-post-id="${currentData?.data[0]?.post_id}"]`
//           );
//           if (activeElement) {
//             activeElement.scrollIntoView({ block: "center" });
//           }
//         }

//         setRefresh(false);
//       };
//       fetchData();
//     }
//   }, [refresh]);

//   const handleTabClick = (tab: number) => {
//     dispatch(setPage(1));
//     dispatch(setCurrentActivePost(null));
//     dispatch(
//       setVideos({
//         follow: [],
//         foryou: [],
//       })
//     );
//     if (currentTab !== tab) {
//       dispatch(setCurrentTab(tab));

//       // setCurrentTab(tab); // Update the current tab

//       // dispatch(setVideos([]));

//       //setVideos([]);

//       // // Update the Swiper active index
//       // if (swiperRef.current) {
//       //   swiperRef.current.slideTo(tab); // Change the Swiper index to match the clicked tab
//       // }
//     } else {
//       // const videoKey =
//       //   currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
//       // dispatch(
//       //   setVideos({
//       //     ...videos,
//       //     [videoKey]: [], // Append to the current tab
//       //   })
//       // );
//       dispatch(setStart(false));

//       setRefresh(true);
//     }
//   };

//   const handleRefresh = () => {
//     const videoKey =
//       currentTab === 2 ? "foryou" : currentTab === 0 ? "follow" : "";
//     dispatch(setPage(1));
//     dispatch(setCurrentActivePost(null));
//     dispatch(setStart(false));

//     dispatch(
//       setVideos({
//         ...videos,
//         [videoKey]: [], // Append to the current tab
//       })
//     );
//     if (currentTab === 2) {
//       forYouRefetch();
//     } else if (currentTab === 0) {
//       followRefetch();
//     }
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <div className="max-w-[1024px] home-main w-full">
//         <TopNavbar currentTab={currentTab} onTabClick={handleTabClick} />
//         {/*<Swiper
//           initialSlide={currentTab} // Start from the third slide (index 2)
//           onSlideChange={handleSlideChange}
//           onSwiper={(swiper) => (swiperRef.current = swiper)}
//           slidesPerView={1}
//           spaceBetween={10}
//         > */}

//         <div className="app bg-[#16131C]">
//           {refresh ? (
//             <div className="bg-[#232323] rounded-xl px-4 py-0">
//               <img src={loader} alt="" width={50} height={50} />
//             </div>
//           ) : (
//             <>
//               {/* <SwiperSlide> */}
//               {currentTab === 0 &&
//                 (isLoading && videosToRender?.length === 0 ? (
//                   <div className="app bg-[#16131C]">
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: "20px",
//                       }}
//                     >
//                       <div className="heart">
//                         <img
//                           src={loader}
//                           className="w-[100px] h-[100px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : !isError ? (
//                   <>
//                     <div
//                       ref={videoContainerRef}
//                       className={`app__videos pb-[80px] `}
//                     >
//                       {videos["follow"]?.map((video: any, index: any) => (
//                         <div
//                           key={index}
//                           className="video mt-[20px]"
//                           data-post-id={video?.post_id} // Add post ID to the container
//                         >
//                           <VideoContainer
//                             // refetchUser={refetchUser}
//                             videoData={videoData}
//                             indexRef={indexRef}
//                             abortControllerRef={abortControllerRef}
//                             container={videoContainerRef.current}
//                             status={true}
//                             countNumber={countNumber}
//                             video={video}
//                             // coin={user?.coins}
//                             setCountNumber={setCountNumber}
//                             config={config}
//                             countdown={countdown}
//                             setWidth={setWidth}
//                             setHeight={setHeight}
//                             setHearts={setHearts}
//                             setCountdown={setCountdown}
//                             width={width}
//                             height={height}
//                             // setShowHeart={setShowHeart}
//                           />

//                           {video?.type !== "ads" && (
//                             <VideoFooter
//                               badge={video?.user?.badge}
//                               id={video?.user?.id}
//                               tags={video?.tag}
//                               title={video?.title}
//                               username={video?.user?.name}
//                               city={video?.city}
//                             />
//                           )}

//                           {video?.type === "ads" && (
//                             <Ads ads={video?.ads_info} />
//                           )}

//                           {hearts.map((id: any) => (
//                             <HeartCount id={id} key={id} remove={removeHeart} />
//                           ))}

//                           {/* {showHeart && (
//                             <ShowHeartCom
//                               countNumber={countNumber}
//                               nickname={user?.nickname}
//                               photo={user?.profile_photo}
//                             />
//                           )}
//                           {showHeart && (
//                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999]">
//                               <CountdownCircle countNumber={countNumber} />
//                             </div>
//                           )} */}
//                         </div>
//                       ))}
//                     </div>

//                     {(!followData?.data?.length ||
//                       !forYouData?.data?.length) && (
//                       <p style={{ textAlign: "center" }}>
//                         {/* <b>You have seen all videos</b> */}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="app bg-[#16131C]">
//                     <div style={{ textAlign: "center", padding: "20px" }}>
//                       <div className="text-white flex flex-col justify-center items-center  gap-2">
//                         <div>
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="33"
//                             height="33"
//                             viewBox="0 0 33 33"
//                             fill="none"
//                           >
//                             <path
//                               d="M24.4993 28.7502C24.4993 25.9212 23.3755 23.2081 21.3752 21.2077C19.3748 19.2073 16.6617 18.0835 13.8327 18.0835C11.0037 18.0835 8.2906 19.2073 6.29021 21.2077C4.28982 23.2081 3.16602 25.9212 3.16602 28.7502"
//                               stroke="#888888"
//                               stroke-width="2"
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                             />
//                             <path
//                               d="M13.8327 18.0833C17.5146 18.0833 20.4993 15.0986 20.4993 11.4167C20.4993 7.73477 17.5146 4.75 13.8327 4.75C10.1508 4.75 7.16602 7.73477 7.16602 11.4167C7.16602 15.0986 10.1508 18.0833 13.8327 18.0833Z"
//                               stroke="#888888"
//                               stroke-width="2"
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                             />
//                             <path
//                               d="M29.8337 27.4164C29.8337 22.9231 27.1671 18.7498 24.5004 16.7498C25.3769 16.0921 26.0779 15.2286 26.5411 14.2355C27.0044 13.2424 27.2157 12.1504 27.1564 11.0562C27.0971 9.96195 26.7689 8.89922 26.201 7.96204C25.6331 7.02486 24.8429 6.24212 23.9004 5.68311"
//                               stroke="#888888"
//                               stroke-width="2"
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                             />
//                           </svg>
//                         </div>
//                         <div className="follow-error">关注您喜欢的作者</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               {/* </SwiperSlide> */}
//               {/* <SwiperSlide> */}
//               {currentTab == 1 && (
//                 <div className="w-screen">
//                   <Explorer />
//                 </div>
//               )}
//               {/* </SwiperSlide>
//           <SwiperSlide> */}
//               {currentTab == 2 &&
//                 (isLoading && videosToRender?.length === 0 ? (
//                   <div className="app bg-[#16131C]">
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: "20px",
//                       }}
//                     >
//                       <div className="heart">
//                         <img
//                           src={loader}
//                           className="w-[100px] h-[100px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : !isError ? (
//                   <>
//                     <div
//                       ref={videoContainerRef}
//                       className={`app__videos pb-[80px]`}
//                     >
//                       {videosToRender?.map((video: any, index: any) => (
//                         <div
//                           key={index}
//                           className="video mt-[20px]"
//                           data-post-id={video.post_id} // Add post ID to the container
//                         >
//                           <VideoContainer
//                             // refetchUser={refetchUser}
//                             videoData={videoData}
//                             indexRef={indexRef}
//                             abortControllerRef={abortControllerRef}
//                             container={videoContainerRef.current}
//                             status={true}
//                             countNumber={countNumber}
//                             video={video}
//                             setCountNumber={setCountNumber}
//                             config={config}
//                             // coin={user?.coins}
//                             countdown={countdown}
//                             setWidth={setWidth}
//                             setHeight={setHeight}
//                             setHearts={setHearts}
//                             setCountdown={setCountdown}
//                             width={width}
//                             height={height}
//                             // setShowHeart={setShowHeart}
//                           />

//                           {video?.type !== "ads" && (
//                             <VideoFooter
//                               badge={video?.user?.badge}
//                               id={video?.user?.id}
//                               tags={video?.tag}
//                               title={video?.title}
//                               username={video?.user?.name}
//                               city={video?.city}
//                             />
//                           )}

//                           {video?.type === "ads" && (
//                             <Ads ads={video?.ads_info} />
//                           )}

//                           {hearts.map((id: any) => (
//                             <HeartCount id={id} key={id} remove={removeHeart} />
//                           ))}

//                           {/* {showHeart && (
//                             <ShowHeartCom
//                               countNumber={countNumber}
//                               nickname={user?.nickname}
//                               photo={user?.profile_photo}
//                             />
//                           )}

//                           {showHeart && (
//                             <div className="absolute bottom-[300px] right-[70px] transform z-[999]">
//                               <CountdownCircle countNumber={countNumber} />
//                             </div>
//                           )} */}
//                         </div>
//                       ))}
//                     </div>

//                     {(!followData?.data?.length ||
//                       !forYouData?.data?.length) && (
//                       <p style={{ textAlign: "center" }}>
//                         {/* <b>You have seen all videos</b> */}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="app bg-[#16131C]">
//                     <div style={{ textAlign: "center", padding: "20px" }}>
//                       <div className="text-white flex flex-col justify-center items-center  gap-2">
//                         <div>
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="32"
//                             height="33"
//                             viewBox="0 0 32 33"
//                             fill="none"
//                           >
//                             <path
//                               d="M11.4031 4.62095L11.403 4.62082C14.0022 3.54025 16.8802 3.35193 19.5939 4.08509C22.3076 4.81823 24.7089 6.43272 26.4261 8.68014L26.4263 8.68032C26.4937 8.76877 26.5718 8.84833 26.6556 8.91565L27.2033 9.35581L26.5006 9.36052L21.7383 9.39246C20.9726 9.39847 20.3567 10.0226 20.3627 10.7872L20.3627 10.7877C20.3672 11.5526 20.9924 12.1689 21.7575 12.1629L21.7578 12.1629L29.9185 12.1079L29.9188 12.1079M11.4031 4.62095L31.5441 10.6738C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095C8.80635 5.69987 6.62978 7.61268 5.21499 10.066C3.80005 12.5178 3.22479 15.3727 3.57938 18.1896C3.93397 21.0065 5.19865 23.6248 7.17475 25.6426L7.17484 25.6426C9.15302 27.6604 11.732 28.9637 14.5143 29.3547C17.2967 29.7475 20.1293 29.2043 22.578 27.8108L22.5781 27.8107C25.0249 26.417 26.9521 24.2493 28.0576 21.6402C28.3569 20.9349 29.1703 20.6058 29.8752 20.905L29.8755 20.905C30.5785 21.2025 30.9079 22.0155 30.6087 22.7208L30.6086 22.7209C29.2671 25.888 26.9264 28.5235 23.9488 30.2193C20.9694 31.9151 17.5185 32.5769 14.1274 32.0984L14.1273 32.0984C10.7378 31.6215 7.59926 30.0339 5.19598 27.5819C2.79267 25.1299 1.25895 21.9508 0.829223 18.5357C0.399503 15.1204 1.09649 11.6584 2.81532 8.68015L2.81534 8.68011C4.53244 5.70358 7.17669 3.37559 10.341 2.06238L10.3411 2.06233C13.5054 0.747344 17.01 0.518603 20.3157 1.41094M11.4031 4.62095L31.2942 10.6809C31.5566 11.1139 31.3915 11.5398 31.0863 11.8574C30.7811 12.1751 30.3605 12.3543 29.9205 12.3579L29.9188 12.1079M11.4031 4.62095L31.2942 10.6809M29.9188 12.1079C30.2921 12.1048 30.648 11.9527 30.9061 11.6842C31.165 11.4147 31.3048 11.0538 31.2942 10.6809M29.9188 12.1079L31.2942 10.6809M31.2942 10.6809L31.0405 2.09452C31.0179 1.33093 30.3788 0.728074 29.6155 0.750614L29.6155 0.750615C28.8505 0.773158 28.2491 1.41193 28.2716 2.17735L28.2716 2.1774L28.3834 5.99257L28.4037 6.68592L27.9458 6.16495C25.9267 3.8682 23.2757 2.21083 20.3157 1.41094M20.3157 1.41094C20.3157 1.41095 20.3157 1.41095 20.3157 1.41096L20.3809 1.16961L20.3157 1.41094ZM20.1127 10.7892C20.118 11.6924 20.8562 12.42 21.7594 12.4129L21.7364 9.14247C20.8331 9.14956 20.1056 9.88598 20.1127 10.7892Z"
//                               fill="white"
//                               stroke="#16131C"
//                               stroke-width="0.5"
//                             />
//                           </svg>
//                         </div>
//                         <div className=" text-white">
//                           网络连接失败，点击重试
//                         </div>
//                         <div className="follow-error">加载失败，请稍后重试</div>
//                         <button
//                           onClick={handleRefresh}
//                           className="refreshBtn px-5 py-1"
//                         >
//                           重试
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               {/* </SwiperSlide> */}
//             </>
//           )}
//         </div>
//         {/* </Swiper> */}
//       </div>
//     </div>
//   );
// };

// export default memo(Home);
