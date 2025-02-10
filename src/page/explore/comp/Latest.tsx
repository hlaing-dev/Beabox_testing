import React, { useEffect, useRef, useState } from "react";
// import sp from "../../../assets/explore/sp.png";
import { FaHeart } from "react-icons/fa";
import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { Person } from "@/assets/profile";
import Loader from "../../../page/home/vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { setDetails } from "@/store/slices/exploreSlice";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/routes/paths";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import personE from "../../../assets/explore/personE.svg";

interface LatestPorp {
  list_id: string;
}

const Latest: React.FC<LatestPorp> = ({ list_id }) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetExploreListQuery({ id: list_id, page });
  const navigate = useNavigate();
  const scrollPositionRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPositionRef.current;
    }
  }, []);

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);

      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
    } else {
      setHasMore(false);
    }
  }, [data]);
  // console.log(data?.data)

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  const showDetailsVod = (file: any) => {
    scrollPositionRef.current = contentRef.current?.scrollTop || 0;
    dispatch(setDetails(file));
    navigate("/vod_details");
  };
  // console.log(waterfall);
  return (
    <>
      {isLoading ? (
        <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px]">
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
        </div>
      ) : (
        <div className=" flex w-full justify-center">
          <div
            className=" grid grid-cols-2 relative gap-[10px] px-2"
            ref={contentRef}
          >
            <>
              {waterfall?.map((card: any, index: number) => (
                <div
                  key={index}
                  className="chinese_photo h-[320px] max-w-full shadow-lg relative"
                >
                  <div
                    className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
                    onClick={() => showDetailsVod(card)}
                  >
                    <ImageWithPlaceholder
                      src={card?.preview_image}
                      alt={card.title || "Video"}
                      width={"100%"}
                      height={calculateHeight(
                        card?.files[0]?.width,
                        card?.files[0]?.height
                      )}
                      className=" object-cover h-full w-full rounded-none"
                    />
                  </div>
                  <h1 className="search_text font-cnFont line-clamp-2 text-left text-[12px] font-[400] px-[6px] pt-[6px]">
                  {/* <h1 className="search_text font-cnFont px-[6px] line-clamp-2 text-left"> */}
                    {card.title.length > 50
                      ? `${card.title.slice(0, 50)}...`
                      : card.title}
                  </h1>
                  <div className="  w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center ">
                    <div className=" flex justify-center items-center gap-[4px]">
                      {card.user?.avatar ? (
                        <img
                          className=" w-[20px] h-[20px] rounded-full"
                          src={card.user.avatar}
                          onError={(e) => (e.currentTarget.src = personE)}
                          alt=""
                        />
                      ) : (
                        <img
                          src={personE}
                          className="w-[20px] h-[20px] rounded-full"
                          alt=""
                        />
                      )}
                      <h1 className=" text-[#888] text-[12px] font-[500]">
                        {card.user.name}
                      </h1>
                    </div>
                    <span className="flex gap-[5px] items-center">
                      {/* <FaHeart /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="12"
                        viewBox="0 0 13 12"
                        fill="none"
                      >
                        <path
                          d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
                          stroke="#BBBBBB"
                          stroke-width="0.8"
                        />
                      </svg>
                      <h1 className=" text-[#888] text-[12px] font-[400] leading-[20px]">
                        {formatNumber(card?.like_count)}
                      </h1>
                    </span>
                  </div>
                </div>
              ))}
              <InfiniteScroll
                className="py-[20px]"
                dataLength={waterfall.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className=" flex justify-center w-screen absolute bottom-[-30px] left-[-20px]">
                    <div className="">
                      <img
                        src={Loader}
                        className="w-[70px] h-[70px]"
                        alt="Loading"
                      />
                    </div>
                  </div>
                }
                endMessage={
                  <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                    <p className="py-10" style={{ textAlign: "center" }}>
                      {/* <b>No more yet!</b> */}
                    </p>
                  </div>
                }
              >
                <></>
              </InfiniteScroll>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default Latest;
