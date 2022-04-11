import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { AuthInput, AuthState } from "./interface";

import AuthService from "../services/auth.service";

// @ts-ignore
const token = JSON.parse(localStorage.getItem("token"));

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: AuthInput, thunkAPI) => {
    try {
      const response = await AuthService.register(email, password);

      if (response.status === 201) {
        console.log("Response", response);

        thunkAPI.dispatch(
          setMessage("Użytkownik został zarejestrowany, możesz się zalogować")
        );
      }

      return response.data;
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

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: AuthInput, thunkAPI) => {
    try {
      console.log("EMAIL", email);
      const data = await AuthService.login(email, password);
      console.log("DATA:", data);
      return { user: data };
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

export const logout = createAsyncThunk("auth/logout", async () => {
  console.log("logout");
  await AuthService.logout();
});

const initialState: AuthState = {
  isAuthenticated: token ? true : false,
  user: {},
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMessage: (state, { payload }) => {
      state.message = payload;
    },
    clearMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (buildier) => {
    buildier.addCase(login.fulfilled, (state, { payload }) => {
      console.log("ACTION: ", payload);
      console.log("USER ", token);
      state.isAuthenticated = true;
      state.user = payload.user;
    });
    buildier.addCase(login.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    });
    buildier.addCase(logout.fulfilled, (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});
const { reducer, actions } = authSlice;
export const { setMessage, clearMessage } = actions;
export default reducer;
