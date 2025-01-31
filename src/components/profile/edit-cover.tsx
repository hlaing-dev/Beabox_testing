import { PencilLine, Image, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import {
  useChangeCoverMutation,
  useRemoveCoverMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { setCover } from "@/store/slices/persistSlice";

const EditCover = () => {
  const dispatch = useDispatch();
  const cover = useSelector((state: any) => state.persist.cover);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [settingUpload, { data: settingUploadData }] =
    useSettingUploadMutation();
  const [changeCover, { data: changeCoverData }] = useChangeCoverMutation();
  const [removeCover] = useRemoveCoverMutation();
  const removeHandler = async () => {
    await removeCover(cover);
    dispatch(setCover(null));
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target && typeof e.target.result === "string") {
        setImage(e.target.result);
        console.log("1");
        await settingUpload({ filedata: e.target.result, filePath: "cover_photo" });
        // if (settingUploadData?.status)
        // await profileUpload({ file_url: settingUploadData?.data?.url });
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (settingUploadData?.status) {
      changeCover({ file_url: settingUploadData?.data?.url });
      dispatch(setCover(settingUploadData?.data?.url));
    }
    setIsOpen(false);
    // console.log(settingUploadData?.data?.url, "storage uploaded");
  }, [settingUploadData]);

  console.log(changeCoverData);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="flex gap-2 z-[1200] bg-[#FFFFFF14] px-4 justify-center py-1 rounded-lg items-center">
          <PencilLine size={14} />
          <p className="text-[12px]">设置封面</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1500]">
        <div className="w-full px-5 py-7">
          <div className="space-y-6">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="flex items-center gap-3">
                <div className="bg-[#FFFFFF1F] p-2 rounded-full">
                  <Image size={16} />
                </div>
                <p className="text-[14px]">上传封面</p>
              </label>
            </div>
            <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
            <div className="flex items-center gap-3" onClick={removeHandler}>
              <div className="bg-[#FFFFFF1F] p-2 rounded-full">
                <X size={16} />
              </div>
              <p className="text-[14px]">移除封面</p>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditCover;
