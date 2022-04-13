import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ReservationInput, ScheduleState, ScheduleInput } from "./interface";

import scheduleService from "../services/schdule.service";
import reservationService from "../services/reservation.service";

export const getAllSchdules = createAsyncThunk(
  "schedule/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await scheduleService.fetchAllSchedules();
      if (response.status === 200) {
        thunkAPI.dispatch(setSchedules(response.data));
      } else {
        return [];
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedule/fetchAll",
  async (payload: ScheduleInput[], thunkAPI) => {
    try {
      const response = await scheduleService.postSchedule(payload);

      if (response.status === 201) {
        thunkAPI.dispatch(getAllSchdules());
      } else {
        return [];
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const creatReservation = createAsyncThunk(
  "reservation/create",
  async (payload: ReservationInput, thunkAPI) => {
    try {
      const response = await reservationService.postReservation(payload);
      if (response.status === 201) {
        thunkAPI.dispatch(getAllReservations());
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllReservations = createAsyncThunk(
  "reservation/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await reservationService.fetchAllReservations();
      if (response.status === 200) {
        thunkAPI.dispatch(setReservations(response.data.reservations));
        thunkAPI.dispatch(setStatistics(response.data.statistics));
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteReservations = createAsyncThunk(
  "reservation/delete",
  async (reservationId: number, thunkAPI) => {
    try {
      const response = await reservationService.deleteReservation(
        reservationId
      );

      if (response.status === 200) {
        thunkAPI.dispatch(getAllReservations());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState: ScheduleState = {
  schedules: [],
  reservations: [],
  message: "",
  statistics: [],
};

const scheduleSlice = createSlice({
  name: "schdule",
  initialState,
  reducers: {
    setSchedules: (state, { payload }) => {
      state.schedules = payload;
    },
    clearSchedules: (state) => {
      state.schedules = [];
    },
    setReservations: (state, { payload }) => {
      state.reservations = payload;
    },
    clearReservations: (state) => {
      state.reservations = [];
    },
    setMessage: (state, { payload }) => {
      state.message = payload;
    },
    clearMessage: (state) => {
      state.message = "";
    },
    setStatistics: (state, { payload }) => {
      state.statistics = payload;
    },
    clearStatistics: (state) => {
      state.statistics = [];
    },
  },
});
const { reducer, actions } = scheduleSlice;
export const {
  setSchedules,
  clearSchedules,
  setReservations,
  clearReservations,
  setMessage,
  clearMessage,
  setStatistics,
  clearStatistics,
} = actions;
export default reducer;
