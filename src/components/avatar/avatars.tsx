import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { useGetAvatarListQuery } from "@/store/api/createCenterApi";
import { X } from "lucide-react";
import AvatarImage from "./avatar-image";
import { useAvatarUploadMutation } from "@/store/api/profileApi";
import TranLoader from "../shared/tran-loader";

const Avatars = ({
  setShowAvatar,
  avatarId,
  setAvatarId,
  srcImg,
  setSrcImg,
}: any) => {
  const { data } = useGetAvatarListQuery("");
  const [avatarUpload, { data: avatarUploadData, isLoading: loading2 }] =
    useAvatarUploadMutation();

  const handleUpload = async () => {
    await avatarUpload({ id: avatarId });
    setShowAvatar(false);
  };
  return (
    <div className="bg-[#000000CC] w-full flex justify-center items-center h-screen absolute top-0 left-0 z-50">
      {loading2 ? <TranLoader /> : <></>}
      <div className="bg-[#16131C] rounded-[22px] w-[90%] h-[75%] flex flex-col justify-between">
        <div className="">
          <TopBar setShowAvatar={setShowAvatar} />
        </div>
        <div className="flex-1 overflow-hidden overflow-y-scroll hide-sb">
          <div className="px-5 flex flex-col gap-5">
            {data?.data?.map((list: any, index: any) => (
              <div key={index}>
                <h1
                  className={`text-[14px] mb-4 ${
                    list?.is_available ? "text-white" : "text-[#888888]"
                  }`}
                >
                  {list?.level}
                </h1>
                <div className="flex justify-between">
                  {list?.list?.map((item: any) => (
                    <div
                      className=""
                      key={item?.image}
                      onClick={
                        list?.is_available
                          ? () => {
                              setSrcImg(item?.image);
                              setAvatarId(item?.id);
                            }
                          : () => {}
                      }
                    >
                      <AvatarImage
                        className={`w-[60px] h-[60px] ${
                          avatarId == item?.id
                            ? "border-2 border-[#CD3EFF]"
                            : ""
                        } rounded-full ${
                          !list?.is_available ? "brightness-50" : ""
                        }`}
                        src={item.image}
                        width={"60px"}
                        height={"60px"}
                        alt={""}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={handleUpload}
            className="gradient-bg w-full text-[14px] py-4 rounded-[16px]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avatars;

const TopBar = ({ setShowAvatar }: any) => {
  return (
    <div className="flex justify-between items-center p-5">
      <div className=""></div>
      <div className="">
        <p className="text-[18px]">选择头像</p>
      </div>
      <div className="">
        <button
          onClick={() => setShowAvatar(false)}
          className="bg-[#FFFFFF0A] p-1 rounded-full"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
