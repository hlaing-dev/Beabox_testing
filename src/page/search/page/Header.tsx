import React from "react";

interface HeaderProps {
  tabs: any;
  activeTab: any;
  setActiveTab: any;
  setCurrentPage: any;
}

const Header: React.FC<HeaderProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  setCurrentPage,
}) => {
  return (
    <div className=" flex mb-[26px] px-[16px]">
      {tabs?.map((tt: any, index: number) => (
        <div
          onClick={() => {
            setCurrentPage(1);
            setActiveTab(tt);
          }}
          key={index}
          className=" px-[10px] py-[8px] flex flex-col justify-center items-center"
        >
          <span
            className={`${
              activeTab === tt ? " text-white" : " text-white/60"
            } text-[16px] font-[500]`}
          >
            {tt}
          </span>

          <span
            className={`h-[4px] w-[24px] bg-white ${
              activeTab !== tt ? " opacity-0" : "opacity-100"
            }`}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Header;
