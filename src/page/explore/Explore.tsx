import React, { useEffect, useRef, useState } from "react";
import Header from "./comp/Header";
import "./explore.css";
import Banner from "./comp/Banner";
import PopApp from "./comp/PopApp";
import Recommand from "./comp/Recommand";
import Latest from "./comp/Latest";
import { Swiper } from "swiper/react";
import "swiper/css";
import { SwiperSlide } from "swiper/react";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import VodDetails from "./comp/VodDetails";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setExpHeader } from "@/store/slices/exploreSlice";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend"); // Default tab
  const { exp_header } = useSelector((state: any) => state.explore) || {};
  const [tabs, setTabs] = useState(["Recommend", "Latest", "Hollywood"]);
  const { data } = useGetExploreHeaderQuery("");
  const dispatch = useDispatch();

  // Initialize tabs from API data and ensure a fallback
  useEffect(() => {
    if (data?.data?.tabs) {
      const apiTabs = data.data.tabs.map((t: any) => t.title);
      setTabs([...apiTabs, "Hollywood"]);
    }
  }, [data]);

  // Handle default tab selection on component mount
  useEffect(() => {
    if (!exp_header) {
      dispatch(setExpHeader("Recommend")); // Default to "Recommend"
    }
    setActiveTab(exp_header || "Recommend");
  }, [exp_header, dispatch]);

  // Handle tab click or swipe
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    dispatch(setExpHeader(tab));
  };

  return (
    <div className="flex justify-center items-center w-screen overflow-hidden">
      <div className="explore_sec w-screen xl:w-[800px] flex flex-col justify-center items-center px-[10px] pb-[100px] mt-14">
        <Banner />
        <PopApp />
        <div className="mt-[20px] relative">
          <Header activeTab={activeTab} setActiveTab={handleTabChange} />
          <div
            className="tab-content"
            style={{
              minHeight: "500px", // Consistent height
              transition: "opacity 0.3s ease", // Smooth transitions
            }}
          >
            {exp_header === "Recommend" && (
              <div>
                <Recommand title="Chinese Drama" />
                <Recommand title="Latest Drama" />
              </div>
            )}
            {exp_header === "Latest" && (
              <div>
                <Recommand title="Chinese Drama" />
                <Recommand title="Latest Drama" />
              </div>
            )}
            {exp_header === "Hollywood" && (
              <div>
                <Latest />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
