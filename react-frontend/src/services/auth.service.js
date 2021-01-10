import axios from "axios";
//import BASE_URL from "./hostname";

//const BASE_URL = "192.168.1.100";
const API_URL = `${process.env.REACT_APP_API_BACKEND_URL}/api/auth/`;

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.authenticationToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = (user) => {
  return axios.post(API_URL + "logout", {
    refreshToken: user.refreshToken,
    username: user.username
  }).then(() => {
    localStorage.removeItem("user");
  })
    .catch((e) => {
      console.log(e);
      localStorage.removeItem("user");
    });
};


const authService = {
  register,
  login,
  logout,
};

export default authService;
