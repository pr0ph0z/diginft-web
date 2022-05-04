import {
  ETHERS_CONNECTED_ACCOUNT,
  ETHERS_IS_ACCOUNT_CONNECTED,
  ETHERS_SET_ACCOUNT,
  ETHERS_SET_METAMASK_INSTALL_STATUS,
} from "../actions/ethers";

const initialState = {
  account: null,
  isMetaMaskInstalled: false,
};

export default {
  namespaced: true,
  state: {
    ...initialState,
  },
  actions: {
    [ETHERS_SET_ACCOUNT]: ({ commit }, account) => {
      commit(ETHERS_SET_ACCOUNT, account);
    },
    [ETHERS_SET_METAMASK_INSTALL_STATUS]: ({ commit }) => {
      commit(ETHERS_SET_METAMASK_INSTALL_STATUS, true);
    },
  },
  mutations: {
    [ETHERS_SET_ACCOUNT]: (state, account) => {
      state.account = account;
    },
    [ETHERS_SET_METAMASK_INSTALL_STATUS]: (state, status) => {
      state.isMetaMaskInstalled = status;
    },
  },
  getters: {
    [ETHERS_CONNECTED_ACCOUNT]: ({ account }) =>
      account
        ? `${account.slice(0, 5)}...${account.slice(-3)}`
        : "Connect Wallet",
    [ETHERS_IS_ACCOUNT_CONNECTED]: ({ account }) => account !== null,
  },
};
