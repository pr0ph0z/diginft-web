const initialState = {
  content: "",
  variant: "",
};

export default {
  namespaced: true,
  state: {
    ...initialState,
  },
  actions: {
    showMessage({ commit }, { content, variant }) {
      commit("showMessage", { content, variant });
    },
    dismiss({ commit }) {
      commit("dismiss");
    },
  },
  mutations: {
    showMessage(state, { content, variant }) {
      state.content = content;
      state.variant = variant;
    },
    dismiss(state) {
      state.content = "";
      state.variant = "";
    },
  },
};
