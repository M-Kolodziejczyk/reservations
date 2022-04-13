import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, setSeconds, format } from "date-fns";

import { getAllSchdules } from "../slices/schedule";
import { createSchedule } from "../slices/schedule";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import ScheduleItem from "./ScheduleItem";

import styles from "./Schedule.module.scss";

const Schedule = () => {
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(
    setHours(setMinutes(new Date(), 0), 8)
  );
  const [endTime, setEndTime] = useState(
    setHours(setMinutes(new Date(), 0), 10)
  );
  const { schedules } = useAppSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(getAllSchdules());

    // eslint-disable-next-line
  }, []);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const getDatesInRange = (startDate: any, endDate: any) => {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const handleClick = () => {
    const dates = getDatesInRange(startDate, endDate);

    const schedules = dates.map((date) => ({
      from: format(
        setSeconds(
          setMinutes(
            setHours(new Date(date), new Date(startTime).getHours()),
            0
          ),
          0
        ),
        "Y-LL-dd'T'HH:mm:ssxxxx"
      ),
      to: format(
        setSeconds(
          setMinutes(setHours(new Date(date), new Date(endTime).getHours()), 0),
          0
        ),
        "Y-LL-dd'T'HH:mm:ssxxxx"
      ),
    }));

    dispatch(createSchedule(schedules));
  };

  return (
    <div className={styles.schedule}>
      <p className={styles.schedule__header}> ustal swój harmonogram pracy</p>
      <div className={styles.schedule__container}>
        <div className={styles.schedule__container__date}>
          <p>wybierz zakres dni</p>
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </div>
        <div className={styles.schedule__container__time}>
          <div>
            <p>wybierz godzinę rozpoczęcia pracy</p>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date as Date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="hh:mm aa"
            />
          </div>
          <div>
            <p>Wybierz godzinę zakonczenia pracy</p>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date as Date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="hh:mm aa"
            />
          </div>
          <button className={styles.formBtn} onClick={handleClick}>
            stwórz harmonogram
          </button>
        </div>
        {schedules.length > 0 && (
          <div className={styles.schedule__container__details}>
            <p>Twój harmonogram</p>
            {schedules.map((schedule, index) => (
              <ScheduleItem schedule={schedule} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Schedule;
