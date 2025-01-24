import React, { useCallback, useEffect, useState } from 'react'
import Landing from "./components/Landing";
import Routing from "./routes/Routing";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "./store/slices/ModelSlice";
import ErrorToast from "./page/home/services/ErrorToast";

const App = () => {
  const { panding } = useSelector((state: any) => state.model);

  const dispatch = useDispatch();
  const [dataFromIOS, setDataFromIOS] = useState('')

  useEffect(() => {

      // Adding event for IOS app
      window.addEventListener('iosEvent', iosEventHandler);

      return () =>
          window.removeEventListener('iosEvent', iosEventHandler);
  }, [])

  const iosEventHandler = useCallback(
      (e: any) => {
          alert(e);
          console.log(e);
          setDataFromIOS(e);
      },
      [setDataFromIOS]
  )
  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    if (!hasSeenLanding) {
      sessionStorage.setItem("hasSeenLanding", "true");
      dispatch(setPanding(true));
    }
  }, [dispatch]);
  return (
    <>
      {panding ? (
        <Landing />
      ) : (
        <>
          {" "}
          <Routing />
          <ErrorToast />
        </>
      )}
    </>
  );
};

export default App;
