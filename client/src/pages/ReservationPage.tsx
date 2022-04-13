import { useEffect } from "react";
import { useAppDispatch } from "../hooks/redux";

import { getAllSchdules, getAllReservations } from "../slices/schedule";

import Schedule from "../components/Schedule";
import Reservation from "../components/Reservation";

import styles from "./ReservationPage.module.scss";

const ReservationPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllSchdules());
    dispatch(getAllReservations());

    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.reservationPage}>
      <Schedule />

      <Reservation />
    </div>
  );
};
export default ReservationPage;
