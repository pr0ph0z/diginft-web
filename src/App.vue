<template>
  <div>
    <v-app>
      <navbar />
      <v-main ref="app">
        <v-container>
          <router-view :key="$route.fullPath" />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";
import Snackbar from "./components/Snackbar.vue";
import Navbar from "./components/Navbar.vue";
import ethereum from "./services/ethereum";
import EthersService from "./services/ethers";
import { ETHERS, ETHERS_SET_ACCOUNT } from "./store/actions/ethers";

export default {
  name: "App",
  components: {
    Navbar,
  },
  async beforeCreate() {
    const ethersService = new EthersService();
    const eth = await ethereum();
    if (eth !== undefined) {
      await ethersService.connectWallet();
      eth.on("accountsChanged", async accounts => {
        if (accounts.length === 0) {
          this[ETHERS_SET_ACCOUNT]("");
          localStorage.removeItem("walletAddress");
        }
      });
    }
  },
  mounted() {
    this.$root.showSnackbar = this.showSnackbar;
  },
  methods: {
    ...mapActions(ETHERS, [ETHERS_SET_ACCOUNT]),
    showSnackbar(message, variant) {
      const variants = {
        success: {
          color: "green",
          button_color: "white",
        },
        warning: {
          color: "orange darken-1",
          button_color: "white",
        },
        error: {
          color: "red accent-2",
          button_color: "white",
        },
      };
      const ComponentClass = Vue.extend(Snackbar);
      const instance = new ComponentClass({
        propsData: {
          show: true,
          content: message,
          color: variants[variant],
        },
      });
      instance.$mount();
      this.$refs.app.$el.appendChild(instance.$el);
    },
  },
};
</script>

<style>
.grayscale {
  filter: gray;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
</style>
