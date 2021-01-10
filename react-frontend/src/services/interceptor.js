import axios from "axios";
import BASE_URL from "./hostname";

//const BASE_URL = "192.168.1.100";

const user = JSON.parse(localStorage.getItem("user"));
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && originalRequest.url === `${BASE_URL}/api/auth/refresh/token`) {
        return Promise.reject(error);
    }
    if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url
        !== `${BASE_URL}/api/auth/login` && user) {
        originalRequest._retry = true;
        axios.post(`${BASE_URL}/api/auth/refresh/token`,
            {
                "refreshToken": user.refreshToken,
                "username": user.username
            }).then(res => {
                if (res.status === 200) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    // axios.defaults.headers.common['Authorization'] = 'Bearer ' +
                    //     res.data.authenticationToken;
                    originalRequest.headers.Authorization = 'Bearer ' +
                        res.data.authenticationToken;
                    return axios(originalRequest).then(() => {
                        window.location.reload();
                    });
                }
            });
    }
    return Promise.reject(error);
});

export default axios;