import { io } from "socket.io-client";
import Vue from "vue";
import { VueMasonryPlugin } from "vue-masonry";
import VueSocketIOExt from "vue-socket.io-extended";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
const { NODE_ENV, VUE_APP_API, VUE_APP_API_DEV } = process.env;
const socket = io(NODE_ENV === "production" ? VUE_APP_API : VUE_APP_API_DEV);

Vue.use(VueMasonryPlugin);
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
