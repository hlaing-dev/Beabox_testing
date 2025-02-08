import { useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "@/store/api/profileApi";
import { ChevronLeft, Copy } from "lucide-react";
import ProfileAvatar from "@/components/profile/profile-avatar";
import Loader from "@/components/shared/loader";
import OtherStats from "@/components/profile/other-stats";
import VideoTab2 from "@/components/profile/video-tab2";
import FollowStatusBtn from "@/components/profile/follow-status-btn";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";
import defaultCover from "@/assets/cover.jpg";
import { useEffect, useRef, useState } from "react";
import ScrollHeader from "@/components/profile/scroll-header";
import OscrollHeader from "@/components/profile/oscroll-header";

const OtherProfile = () => {
  const { id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const headerRef = useRef<any>(null);
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
  } = useGetUserProfileQuery(id || "");
  console.log(userData?.data, "userData");
  const handleCopy = (text: any) => {
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // console.log(rect);

        if (rect.top < 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);
  if (userLoading) return <Loader />;
  return (
    <>
      <div className="gradient-overlay"></div>
      <img
        src={
          userData?.data?.cover_photo
            ? userData?.data?.cover_photo
            : defaultCover
        }
        alt=""
        className="fixed top-0 left-0 w-full h-[23vh] object-cover object-center"
      />
      {isCopied ? (
        <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
          <p className="text-[14px] bg-[#FFFFFF14] px-2 py-1 rounded-lg w-[83px] text-center">
            已复制 ID
          </p>
        </div>
      ) : (
        ""
      )}
      <div className={`z-[1200] max-h-screen hide-sb profile-bg `}>
        <div className="w-full px-5 flex flex-col items-center gap-3">
          <div className="z-[1200] w-full flex gap-3 my-5 justify-between items-center">
            <ChevronLeft onClick={() => navigate(-1)} />
            <p className="text-[16px] mr-5">{userData?.data?.nickname}</p>
            <div></div>
          </div>
          <div className="w-full flex items-center gap-3 py-5">
            <ProfileAvatar
              progress={userData?.data?.level_progress}
              levelImage={userData?.data?.level}
              photo={userData?.data?.profile_photo}
            />
            {/* <ProfileAvatar
              photo={userData?.data?.profile_photo}
              progressData={userData?.data?.level_progress}
            /> */}
            <div className="z-[1200] flex-1 flex flex-col gap-0.5">
              <p className="z-[1200] text-[18px] flex items-center gap-1">
                {userData?.data?.nickname}
                <span>
                  {userData?.data?.gender == "Male" ? <MaleSVG /> : <></>}
                </span>
                <span>
                  {userData?.data?.gender == "Feale" ? <FemaleSVG /> : <></>}
                </span>
                {/* <span>
                <BsPatchCheckFill className="z-[1200] text-[#888]" />
              </span>{" "} */}
              </p>
              <p className="z-[1200] text-[14px] text-[#BBBBBB] flex items-center gap-2">
                B号 : {userData?.data?.user_code}{" "}
                <Copy
                  onClick={() => handleCopy(userData?.data?.user_code)}
                  size={14}
                />
              </p>
              {userData?.data?.city &&
              userData?.data?.province &&
              userData?.data?.share_region == "on" ? (
                <div className="z-[1200] flex">
                  <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 pt-1 rounded-full justify-center shrink-0">
                    <span>{userData?.data?.province}</span>:
                    <span>{userData?.data?.city}</span>
                  </div>
                </div>
              ) : (
                <div className="z-[1200] flex">
                  <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                    <span>未知</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 className="text-[12px] text-[#888] mb-5 italic px-5 z-[1200] relative">
          {userData?.data?.bio && userData?.data?.hide_bio == "off"
            ? userData?.data?.bio
            : ""}
        </h1>
        <div className="z-[1200] relative px-5">
          <OtherStats
            followers={userData?.data?.followers_count}
            following={userData?.data?.following_count}
            likecount={userData?.data?.likes_sum_count}
          />
          <FollowStatusBtn
            userData={userData}
            id={id}
            refetch={refetch}
            userLoading={userLoading}
          />
        </div>
        <div ref={headerRef} className="sticky z-[1300] top-0 w-full"></div>
        {false ? (
          <OscrollHeader
            photo={userData?.data?.profile_photo}
            name={userData?.data?.nickname}
            id={userData?.data?.id}
          />
        ) : (
          <></>
        )}
        {/* <div className={`sticky top-[100px] z-[1200]`}> */}
          <div className="z-[1200] relative px-5">
            <VideoTab2
              id={id}
              showHeader={false}
              visibility={userData?.data?.content_visibility}
            />
          </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default OtherProfile;
