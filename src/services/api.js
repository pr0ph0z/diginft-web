import axios from "axios";
import { EventBus } from "@/eventBus";

const { NODE_ENV, VUE_APP_API, VUE_APP_API_DEV } = process.env;

const instance = axios.create({
  baseURL: NODE_ENV === "production" ? VUE_APP_API : VUE_APP_API_DEV,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    EventBus.$emit("createSnackbar", {
      snackbar_message: error.response.data.message,
      variant: "error",
    });
    return Promise.reject(error);
  }
);

export default () => {
  return instance;
};
