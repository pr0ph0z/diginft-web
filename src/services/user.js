import api from "./api";

const moduleName = "user";

export default {
  find(id) {
    return api().get(`${moduleName}/${id}`);
  },
};
