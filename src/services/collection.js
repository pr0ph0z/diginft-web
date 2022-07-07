import api from "./api";
import authHeader from "@/helpers/auth-header";

const moduleName = "collection";

export default {
  get() {
    return api().get(`${moduleName}`);
  },
  find(id) {
    return api().get(`${moduleName}/${id}`);
  },
  create(data) {
    return api().post(`${moduleName}/create`, data, {
      headers: authHeader(),
    });
  },
  my() {
    return api().get(`${moduleName}/my`, {
      headers: authHeader(),
    });
  },
  update(id, data) {
    return api().put(`${moduleName}/${id}/update`, data, {
      headers: authHeader(),
    });
  },
  delete(id) {
    return api().delete(`${moduleName}/${id}/delete`, {
      headers: authHeader(),
    });
  },
};
