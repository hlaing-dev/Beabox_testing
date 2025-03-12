import { paths } from "@/routes/paths";
import React from "react";
import { useNavigate } from "react-router-dom";

const UploadProgress = ({
  uploadPercentage,
  uploadedSize,
  totalSize,
  onCancel,
  successEnd,
  setsuccessEnd,
  refetch,
  seteditPost,
}: any) => {
  const navigate = useNavigate();

  const govideos = () => {
    seteditPost(null);
    setsuccessEnd(false);
    refetch();
    navigate(paths.your_videos);
  };
  return (
    // <div className="bg-transparent h-screen">
    //   {/* Progress Text */}

    //   <div className="flex flex-col items-center justify-center min-h-[100vh]">
    //     <div className="flex w-[60%] justify-between items-center mb-2">
    //       <div className="uploading_text">Uploading {uploadPercentage}%</div>

    //       {/* File Size Info */}
    //       <div className="uploading_text1">
    //         {uploadedSize}MB / {totalSize}MB
    //       </div>
    //     </div>

    //     {/* Progress Bar */}
    //     <div className="w-[60%] h-2 bg-progress rounded-full relative">
    //       <div
    //         className="h-2 rounded-full bg-progress1"
    //         style={{ width: `${uploadPercentage}%` }}
    //       ></div>
    //     </div>

    //     {/* Cancel Button */}
    //     {!successEnd && (
    //       <button
    //         className="mt-10 cancel_upload cursor-pointer"
    //         onClick={onCancel}
    //       >
    //         Cancel Uploading
    //       </button>
    //     )}

    //     {successEnd && (
    //       <div className="flex items-center gap-5">
    //         <button
    //           className="mt-10 cancel_upload cursor-pointer"
    //           onClick={() => setsuccessEnd(false)}
    //         >
    //           Continue Uploading
    //         </button>
    //         <button
    //           className="mt-10 cancel_upload cursor-pointer"
    //           onClick={govideos}
    //         >
    //           View Post Status
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="bg-[#000000A3] w-full h-screen flex items-center justify-center">
      <div className="w-[350px] bg-[#16131C] rounded-[20px] p-4">
        <div className=" flex items-center justify-between">
          <div className="text-[16px]">Uploading {uploadPercentage}%</div>

          <div className="text-[12px] text-[#FFFFFF]">
            {uploadedSize}MB / {totalSize}MB
          </div>
        </div>

        <div className="w-full h-4 my-4 overflow-hidden bg-progress rounded-full relative">
          <div
            className="h-full overflow-hidden rounded-full bg-progress1"
            style={{ width: `${uploadPercentage}%` }}
          ></div>
        </div>
        {!successEnd && (
          <button
            className="w-full bg-[#FFFFFF14] text-[16px] py-2 rounded-[16px] cursor-pointer"
            onClick={onCancel}
          >
            Cancel Uploading
          </button>
        )}

        {successEnd && (
          <div className="flex items-center gap-5">
            <button
              className="px-2 w-full bg-[#FFFFFF14] text-[14px] py-2 rounded-[16px] cursor-pointer"
              onClick={() => setsuccessEnd(false)}
            >
              Continue Uploading
            </button>
            <button
              className="px-2 w-full bg-[#FFFFFF14] text-[14px] py-2 rounded-[16px] cursor-pointer"
              onClick={govideos}
            >
              View Post Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;
