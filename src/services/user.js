import api from "./api";
import authHeader from "@/helpers/auth-header";

const moduleName = "user";

export default {
  find(id) {
    return api().get(`${moduleName}/${id}`);
  },
  update(data) {
    return api().put(`${moduleName}/update-profile`, data, {
      headers: authHeader(),
    });
  },
};
