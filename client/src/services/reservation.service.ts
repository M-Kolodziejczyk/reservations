import axios from "axios";
import authHeader from "./auth-header";
import { ReservationInput } from "../slices/interface";

const API_URL = "http://localhost:3333/reservation/";

const postReservation = (payload: ReservationInput) => {
  return axios.post(
    API_URL,
    {
      title: payload.title,
      date: payload.date,
    },
    {
      headers: authHeader(),
    }
  );
};

const fetchAllReservations = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const deleteReservation = (reservationId: number) => {
  return axios.delete(
    API_URL + reservationId,

    {
      headers: authHeader(),
    }
  );
};

const reservationService = {
  postReservation,
  fetchAllReservations,
  deleteReservation,
};

export default reservationService;
