import axios from "axios";

const { NODE_ENV, VUE_APP_API, VUE_APP_API_DEV } = process.env;

const instance = axios.create({
  baseURL: NODE_ENV === "production" ? VUE_APP_API : VUE_APP_API_DEV,
});

export default () => {
  return instance;
};
