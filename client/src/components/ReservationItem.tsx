import { format } from "date-fns";
import { useAppDispatch } from "../hooks/redux";
import { deleteReservations } from "../slices/schedule";

import styles from "./ReservationItem.module.scss";

interface Props {
  reservation: {
    id: number;
    title: string;
    from: string;
    to: string;
  };
}

function ReservationItem({ reservation }: Props) {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteReservations(reservation.id));
  };

  return (
    <div className={styles.reservationItem}>
      <p className={styles.reservationItem__title}>{reservation.title}</p>
      <p className={styles.reservationItem__date}>
        {format(new Date(reservation.from), "yyyy-MM-dd HH:mm")}
        {" -- "}
        {format(new Date(reservation.to), "yyyy-MM-dd HH:mm")}
      </p>
      <div className={styles.reservationItem__buttons}>
        <button
          className={styles.reservationItem__buttons__btn}
          onClick={handleDelete}
        >
          usuń
        </button>
      </div>
    </div>
  );
}

export default ReservationItem;
