import Cookies from "js-cookie";
import axios from "axios";
import { BaseUrl, UsermanagementURL } from "./baseUrl";
import { dialogHandler } from "./DialogProvider";

const authToken = Cookies.get("authToken");

export const AxiosInstance = axios.create({
    baseURL: BaseUrl,
    timeout: 500000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
});

export const AxiosInstanceMultipart = axios.create({
    baseURL: BaseUrl,
    timeout: 500000,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${authToken}`,
    },
});

export const AxiosInstanceUserManagement = axios.create({
    baseURL: UsermanagementURL,
    timeout: 500000,
    headers: {
        "Content-Type": "application/json",
    },
});

function error401Interceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        dialogHandler.showDialog(
          "Error 401 - Unauthorized",
          "Sorry, Your request could not be processed.",
          () => {
            Cookies.remove('authToken');
            window.location.href = "/authenticate/signin";
          }
        );
      }
      return Promise.reject(error);
    }
  );
}

error401Interceptor(AxiosInstance);
error401Interceptor(AxiosInstanceMultipart);
error401Interceptor(AxiosInstanceUserManagement);