import Cookies from "js-cookie";
import axios from "axios";
import { BaseUrl, UsermanagementURL } from "./baseUrl";

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