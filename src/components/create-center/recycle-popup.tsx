const RecyclePopup = ({
  setShow,
  action,
  postDeleteHandler,
  postRestoreHandler,
}: any) => {
  console.log(action);
  return (
    <div className="z-50 h-screen w-full fixed top-0 left-0 bg-[#000000CC] flex justify-center items-center transition-all duration-75 ease-in-out">
      <div className="bg-[#16131C] mx-8 pt-5 rounded-[16px] flex flex-col justify-center items-center">
        <div className="pt-5 px-5">
          <p className="text-[16px] w-[280px] text-[#BBBBBB] text-center">
            {action == "delete"
              ? `Are you sure this video will delete permanently and this will not be restored.`
              : `Are you sure this video will be restored.`}
          </p>
        </div>
        <div className="bg-[#222222] h-[0.3px] mt-5 w-full"></div>
        <div className="flex h-[56px] w-full">
          <button onClick={() => setShow(false)} className="flex-1 text-[17px]">
            取消
          </button>
          <div className="bg-[#222222] w-[0.3px] h-100"></div>
          <button
            onClick={
              action == "delete"
                ? () => postDeleteHandler()
                : () => postRestoreHandler("restore")
            }
            className="flex-1 text-[17px] text-[#C23033]"
          >
            {action == "delete" ? "消除" : "恢复"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecyclePopup;
