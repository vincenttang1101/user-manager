import axios, { AxiosInstance } from "axios";

class HttpService {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: "https://668a4a4d2c68eaf3211c67d4.mockapi.io/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor
    this.instance.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this.instance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }
}

// Tạo và export một instance của HttpService
const httpService = new HttpService().instance;
export default httpService;
