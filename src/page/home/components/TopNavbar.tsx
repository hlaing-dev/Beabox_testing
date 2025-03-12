import { paths } from "@/routes/paths";
import { Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import upload from "@/assets/createcenter/upload.svg";

const TopNavbar = ({
  currentTab,
  onTabClick,
}: {
  currentTab: number;
  onTabClick: (tab: number) => void;
}) => {
  const navigate = useNavigate();
  const TABS = [
    { text: "关注", id: 0 },
    { text: "探索", id: 1 },
    { text: "推荐", id: 2 },
  ];

  return (
    <div className="absolute top-5 left-0 px-5 right-0 flex justify-between items-center z-[9999] max-w-[480px] mx-auto">
      <div
        onClick={() => navigate(paths.creator_upload)}
        className="flex items-center gap-1 mb-2"
      >
        <img src={upload} alt="" />
        <p className="text-[16px]">创作</p>
      </div>
      <div className="flex gap-2 items-center text-white">
        {TABS.map((tab, index) => (
          <button
            key={index}
            className={`px-2 py-1   flex flex-col items-center justify-center ${
              currentTab === tab.id
                ? "opacity-100 font-semibold"
                : "opacity-50 font-normal"
            } nav_text`}
            onClick={() => onTabClick(tab.id)}
          >
            <div className="mb-3 capitalize">
              {tab.text === "for_you" ? "For You" : tab.text}
            </div>
            {currentTab === tab.id && (
              <div className="w-[28px] h-[2px] bg-white"></div>
            )}
          </button>
        ))}
      </div>

      {/* <div className="px-3 pb-1"> */}
      <Link to={"/search_overlay"} className="pb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20.3322 14.5005C20.6071 13.6385 20.7554 12.72 20.7554 11.7669C20.7554 6.80263 16.7311 2.77832 11.7669 2.77832C6.80264 2.77832 2.77832 6.80263 2.77832 11.7669C2.77832 16.7311 6.80264 20.7555 11.7669 20.7555C14.1298 20.7555 16.2798 19.8437 17.8842 18.3527"
            stroke="white"
            stroke-width="1.22727"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18.0186 18.4849L21.5426 21.9998"
            stroke="white"
            stroke-width="1.22727"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Link>
      {/* </div> */}
    </div>
  );
};

export default TopNavbar;
