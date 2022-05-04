import Vue from "vue";
import Vuex from "vuex";

import ethers from "./modules/ethers";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { ethers },
});
