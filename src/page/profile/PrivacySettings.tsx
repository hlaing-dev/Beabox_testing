import DisableFollow from "@/components/profile/disable-follow";
import HideBio from "@/components/profile/hide-bio";
import PrivateProfile from "@/components/profile/private-profile";
import ShareRegion from "@/components/profile/share-region";
import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const PrivacySettings = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between bg-[#16131C]">
      <div className="w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.settings}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Privacy Settings</p>
          <div></div>
        </div>
        <div className="space-y-6">
          <PrivateProfile />
          <div className="border-b border-white/10"></div>

          <DisableFollow />
          <div className="border-b border-white/10"></div>

          <HideBio />
          <div className="border-b border-white/10"></div>
          <ShareRegion />
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
