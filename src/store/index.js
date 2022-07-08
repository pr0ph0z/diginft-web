import Vue from "vue";
import Vuex from "vuex";

import ethers from "./modules/ethers";
import snackbar from "./modules/snackbar";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { ethers, snackbar },
});
