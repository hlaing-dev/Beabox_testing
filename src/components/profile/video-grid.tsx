import InfiniteScroll from "react-infinite-scroll-component";
import Upload from "./upload";
import VideoCard from "./video-card";
import Loader from "../../page/home/vod_loader.gif";

const VideoGrid = ({ isUpload, data, hasMore, fetchMoreData }: any) => {
  // console.log(data);
  return (
    <div className="py-4 pb-28 absolute">
      <div className="grid grid-cols-3 gap-2">
        {isUpload ? <Upload /> : <></>}
        {data && (
          <>
            {data?.map((item: any) => (
              <VideoCard key={item?.id} videoData={item} />
            ))}
            <InfiniteScroll
              className="my-[50px]"
              dataLength={data.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className=" flex justify-center w-screen h-[500px absolute bottom-[-10px] left-[-20px]">
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
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
