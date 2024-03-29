import api from "./api";
import authHeader from "@/helpers/auth-header";

const moduleName = "item";

export default {
  get(search) {
    return api().get(
      `${moduleName}?${search !== null ? `search=${search}` : ""}`
    );
  },
  find(id) {
    return api().get(`${moduleName}/${id}`);
  },
  favorite(id) {
    return api().post(
      `${moduleName}/${id}/favorite`,
      {},
      {
        headers: authHeader(),
      }
    );
  },
  unfavorite(id) {
    return api().post(
      `${moduleName}/${id}/unfavorite`,
      {},
      {
        headers: authHeader(),
      }
    );
  },
  assignCollection(id, collectionId) {
    return api().patch(
      `${moduleName}/${id}/assign-collection`,
      { collectionId },
      {
        headers: authHeader(),
      }
    );
  },
  random() {
    return api().get(`${moduleName}/random`);
  },
};
