import axios from "axios";
const API_URL = "http://localhost:3333/auth/";

const register = (email: string, password: string) => {
  return axios.post(
    API_URL + "signup",
    {
      email,
      password,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3333/",
      },
    }
  );
};

const login = (email: string, password: string) => {
  console.log("EMAIL: ", email);
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem("token", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
};
export default authService;
