import React, { useEffect, useState } from "react";
import "../wallet.css";
import coin from "../../../assets/wallet/coin.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  useGetMyOwnProfileQuery,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import gg from "../../../assets/wallet/gg.svg";
import we from "../../../assets/wallet/we.svg";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = () => {
  const [balance, setBalance] = useState("");
  const [isHidden, setIsHidden] = useState(false); // State to toggle visibility
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, isLoading, refetch } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data);
  const navigate = useNavigate();
  useEffect(() => {
    setBalance(data?.data.coins || "0");
  }, [data]);

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  console.log(user);

  return (
    <div className="p-[20px]">
      <div className="balance_box p-[22px] flex flex-col gap-[12px]">
        {/* head */}
        <div className="flex justify-cente items-center gap-[6px]">
          <img className="w-[18px] h-[18px]" src={coin} alt="" />
          <span className="text-white text-[14px] font-[500] leading-[20px]">
            可用余额
          </span>
          {/* Toggle between icons */}
          {isHidden ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={toggleVisibility}
            />
          ) : (
            <FaRegEye className="cursor-pointer" onClick={toggleVisibility} />
          )}
        </div>
        <div className="">
          {/* Show balance or asterisks */}
          <span className="text-white text-[32px] font-[500] leading-[20px]">
            {isHidden ? "****" : `${balance}`}

            {!isHidden && <span className=" text-[12px]">. 00</span>}
          </span>
        </div>
        <div className="">
          <h1 className=" text-white text-[12px] font-[700] leading-[22px]">
            作品收益 :{" "}
            <span className=" text-[#CD3EFF]">
              {data?.data?.income_coins ? data?.data?.income_coins : "0"}
            </span>{" "}
            B币
          </h1>
        </div>
        <p className=" w-full h-[1px] bg-white/20"></p>
        <div className=" flex justify-between items-center">
          <div
            onClick={() => navigate(paths.wallet_withdraw)}
            className=" w-1/2 flex justify-between items-center"
          >
            <div className=" flex justify-center items-center gap-[6px]">
              <img src={we} alt="" />
              <span className=" text-white text-[14px] font-[400] leading-[15px]">
                提现
              </span>
            </div>
            <ChevronRight className=" mr-" />
          </div>
          <p className=" w-[1px] h-[30px] mx-5 bg-white/40"></p>
          <div
            onClick={() => navigate(paths.wallet_recharge)}
            className=" w-1/2 flex justify-between items-center"
          >
            <div className=" flex justify-center items-center gap-[6px]">
              <img src={gg} alt="" />
              <span className=" text-white text-[14px] font-[400] leading-[15px]">
                充值
              </span>
            </div>
            <ChevronRight className=" mr-" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
