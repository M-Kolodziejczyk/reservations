import axios from "axios";
import authHeader from "./auth-header";
import { ScheduleInput } from "../slices/interface";

const API_URL = "http://localhost:3333/schedule";

const postSchedule = (payload: ScheduleInput[]) => {
  return axios.post(
    API_URL,
    {
      schedules: payload,
    },
    {
      headers: authHeader(),
    }
  );
};

const fetchAllSchedules = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const scheduleService = {
  postSchedule,
  fetchAllSchedules,
};

export default scheduleService;
