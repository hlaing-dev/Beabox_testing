import {
  useGetInviteQuery,
  useGetTransitionHistoryQuery,
} from "@/store/api/wallet/walletApi";
import React, { useEffect, useState } from "react";
import DatePick from "../comp/DatePick";
import noTran from "../../../assets/wallet/noTran.svg";
import transit from "../../../assets/wallet/transit.png";
import loader from "../../home/vod_loader.gif";

import "../wallet.css";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface RechRecordProps {}

const RechRecord: React.FC<RechRecordProps> = ({}) => {
  const location = useLocation();
  const type = location.pathname === "/wallet/withdraw" ? "withdrawl" : "topup";
  const [curMon, setCurMon] = useState("December");
  const [curYr, setCurYr] = useState(2027);
  const [plus, setPlus] = useState(12);
  const [tran, setTran] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState([]);
  const { data: config } = useGetInviteQuery("");

  useEffect(() => {
    const now = new Date();
    setCurMon(months[now.getMonth()]); // Get current month name
    setCurYr(now.getFullYear()); // Get current year
    setPlus(now.getMonth() + 1); // Month index starts from 0, so +1
  }, []);
  const { data, isLoading } = useGetTransitionHistoryQuery({
    period: `${plus}-${curYr}`,
    type: type,
    page: page,
  });

  useEffect(() => {
    if (data?.data) {
      // setTran(data?.data);
      setTran((prev) => [...prev, ...data.data]);
      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
    } else {
      setHasMore(false);
    }
  }, [data]);

  useEffect(() => {
    if (config?.data) {
      setStatus(config?.data?.transaction_status_list);
    }
  }, [config]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // const getStatusClass = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "approved":
  //       return {
  //         container: "success_state",
  //         text: "success_text",
  //       };
  //     case "pending":
  //       return {
  //         container: "pending_state",
  //         text: "pending_text",
  //       };
  //     case "rejected":
  //       return {
  //         container: "failed_state",
  //         text: "failed_text",
  //       };
  //     default:
  //       return {
  //         container: "default_state",
  //         text: "default_text",
  //       };
  //   }
  // };
  const getStatusClass = (keyword: string) => {
    const statusObj: any = status.find(
      (s: any) => s.keyword.toLowerCase() === keyword.toLowerCase()
    );
    return {
      backgroundColor: statusObj?.bg_color_code || "#777", // Default grey if not found
      color: statusObj?.text_color_code || "#FFF", // Default white if not found
    };
  };

  return (
    <div className=" flex justify-center items-center py-[20px]">
      <div className="w-screen xl:w-[800px]">
        {/* <Header lv={false} title="Transition History" /> */}
        <div className=" px-[20px] flex justify-center items-center"></div>
        {/* time */}
        <DatePick
          curMon={curMon}
          curYr={curYr}
          setCurMon={setCurMon}
          setCurYr={setCurYr}
          setplus={setPlus}
        />
        {/* transition */}
        <div className=" py-[12px] px-[18px]">
          {isLoading ? (
            // <div className=" flex flex-col justify-center items-center h-[300px]">
            //   <img src={noTran} alt="" />
            //   <h1 className=" text-white font-[400] text-[14px]">
            //     Loading ...
            //   </h1>
            // </div>
            <div className=" flex justify-center items-center py-[100px]">
              <div className="heart">
                <img
                  src={loader}
                  className="w-[100px] h-[100px]"
                  alt="Loading"
                />
              </div>
            </div>
          ) : (
            <>
              {data?.data.length === 0 ? (
                <div className=" flex flex-col justify-center items-center h-[600px]">
                  <img src={noTran} alt="" />
                  <h1 className=" text-white font-[400] text-[14px]">
                    No Transition Yet
                  </h1>
                </div>
              ) : (
                <>
                  {tran?.map((ts: any) => (
                    <div
                      key={ts.id}
                      className=" transit_list py-[20px] flex justify-between"
                    >
                      <div className=" flex gap-[12px] items-center">
                        <div className="bitcoin_border p-3">
                          <img
                            className=" w-[26px] h-[26px]"
                            src={transit}
                            alt=""
                          />
                        </div>
                        <div className=" flex flex-col gap-[4px]">
                          <span className=" text-white text-[14px] font-[500] leading-[20px]">
                            {ts.description}
                          </span>
                          <span className=" text-[#777] text-[12px] font-[400] leading-[20px]">
                            {ts.date}
                          </span>
                        </div>
                      </div>
                      <div className=" flex flex-col justify-center items-center gap-[6px]">
                        <span>
                          {ts.dr_cr === "cr" ? "+" : "-"} {ts.amount}
                        </span>
                        {ts.status && (
                          <div
                            style={{
                              backgroundColor: getStatusClass(ts.status)
                                .backgroundColor,
                              color: getStatusClass(ts.status).color,
                            }}
                            className="px-[12px] py-[2px] flex justify-center items-center rounded-md  text-[12px] font-[400] leading-[15px]"
                          >
                            {/* <span
                            style={{}}
                            className=" text-[12px] font-[400] leading-[15px]"
                          > */}
                            {ts.status}
                            {/* </span> */}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <InfiniteScroll
                    className="py-[20px]"
                    dataLength={tran.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <div className=" flex justify-center  bottom-[-30px] left-[-2px]">
                        <div className="">
                          <img
                            src={loader}
                            className="w-[70px] h-[70px]"
                            alt="Loading"
                          />
                        </div>
                      </div>
                    }
                    endMessage={
                      <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                        <p className="py-10" style={{ textAlign: "center" }}>
                          {/* <b>No more yet!</b> */}
                        </p>
                      </div>
                    }
                  >
                    <></>
                  </InfiniteScroll>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RechRecord;
