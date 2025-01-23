import { useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "@/store/api/profileApi";
import { ChevronLeft } from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import ProfileAvatar from "@/components/profile/profile-avatar";
import Loader from "@/components/shared/loader";
import OtherStats from "@/components/profile/other-stats";
import VideoTab2 from "@/components/profile/video-tab2";
import FollowStatusBtn from "@/components/profile/follow-status-btn";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";

const OtherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
  } = useGetUserProfileQuery(id || "");
  console.log(userData);
  if (userLoading) return <Loader />;
  return (
    <div className="px-5 max-h-screen no-scrollbar profile-bg">
      <div className="flex gap-3 my-5 justify-between items-center">
        <ChevronLeft onClick={() => navigate(-1)} />
        <p className="text-[16px] mr-5">{userData?.data?.nickname}</p>
        <div></div>
      </div>
      <div className="w-full flex items-center gap-3 py-5">
        <ProfileAvatar progressData={userData?.data?.level_progress} />
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
          <p className="z-[1200] text-[14px] text-[#BBBBBB]">
            B号 : {userData?.data?.user_code}
          </p>
          {userData?.data?.city && userData?.data?.country ? (
            <div className="z-[1200] flex">
              <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 pt-1 rounded-full justify-center shrink-0">
                <span>{userData?.data?.country}</span>:
                <span>{userData?.data?.city}</span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* <div className="flex-1">
          <p className="text-[18px] flex items-center gap-2">
            {userData?.data?.nickname}
            <span>
              <BsPatchCheckFill className="text-[#888]" />
            </span>{" "}
          </p>
          <div className="flex items-start gap-2 mt-1">
            <img src={userData?.data?.level} className="w-14" alt="" />
            <p className="text-[14px]">(ID {userData?.data?.user_code})</p>
          </div>
        </div> */}
      </div>
      <h1 className="text-[12px] text-[#888] mb-5 italic">
        {userData?.data?.bio ? userData?.data?.bio : ""}
      </h1>
      <OtherStats
        follower={userData?.data?.followers_count}
        following={userData?.data?.following_count}
      />

      <FollowStatusBtn
        userData={userData}
        id={id}
        refetch={refetch}
        userLoading={userLoading}
      />
      <VideoTab2 id={id} />
    </div>
  );
};

export default OtherProfile;
