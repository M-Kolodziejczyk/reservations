import * as Yup from "yup";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, format } from "date-fns";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { creatReservation } from "../slices/schedule";

import ReservationItem from "./ReservationItem";

import styles from "./Reservation.module.scss";

const Reservations = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { reservations, message, statistics } = useAppSelector(
    (state) => state.schedule
  );

  const [startDate, setStartDate] = useState<Date>(
    setHours(setMinutes(new Date(), 0), 8)
  );

  const handleSubmit = ({ title }: { title: string }) => {
    const date = new Date(startDate).toISOString();

    dispatch(creatReservation({ title, date }))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Tytuł jest wymagany"),
  });

  const initialValues = {
    title: "",
  };

  return (
    <div className={styles.reservation}>
      <div className={styles.reservation__container}>
        <div className={styles.reservation__container__formContainer}>
          <p className={styles.header}>Rezerwacja</p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="title">
                  Tytuł
                </label>
                <Field name="title" type="text" className={styles.formInput} />
                <ErrorMessage
                  name="title"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div className={styles.formGroup}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date as Date)}
                  showTimeSelect
                  timeIntervals={60}
                  dateFormat="MMMM d, yyyy HH:mm"
                />
              </div>
              <div className={styles.formGroup}>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={loading}
                >
                  Stwórz rezerwacje
                </button>
              </div>
            </Form>
          </Formik>

          {message && (
            <div className={styles.message} role="alert">
              {message}
            </div>
          )}
        </div>
        <div>
          {reservations.length > 0 && (
            <div>
              <p>Twoje Rezerwacje</p>

              {reservations.map((reservation, index) => (
                <ReservationItem key={index} reservation={reservation} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.reservation__statistic}>
        {statistics.map((statistic) => (
          <div className={styles.reservation__statistic__item}>
            <span>{format(new Date(statistic.date), "yyyy-MM-dd")} </span>
            <span>Rezerwacje: {statistic.reservations} </span>
            <span>Wolne: {statistic.available}H </span>
            <span>Zarezerwowane: {statistic.blocked}H</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Reservations;
