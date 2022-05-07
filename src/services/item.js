import api from "./api";

const moduleName = "item";

export default {
  get() {
    return api().get(`${moduleName}`);
  },
};
