<template>
  <v-app-bar app color="white" elevate-on-scroll>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="@/assets/logo-complete.png"
        transition="scale-transition"
        width="120"
      />
    </div>

    <v-spacer></v-spacer>

    <v-btn :to="{ name: 'Explore' }" class="mx-2" color="primary" text>
      Explore
    </v-btn>

    <v-btn @click="connectWallet" color="primary" outlined text>
      <span
        :class="`${
          ETHERS_IS_ACCOUNT_CONNECTED ? 'success' : 'warning'
        }--text mr-2`"
        >●</span
      >
      {{ ETHERS_CONNECTED_ACCOUNT }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ETHERS,
  ETHERS_CONNECTED_ACCOUNT,
  ETHERS_IS_ACCOUNT_CONNECTED,
} from "../store/actions/ethers";
import EthersService from "../services/ethers";

export default {
  name: "Navbar",
  computed: {
    ...mapGetters(ETHERS, [
      ETHERS_CONNECTED_ACCOUNT,
      ETHERS_IS_ACCOUNT_CONNECTED,
    ]),
  },
  methods: {
    async connectWallet() {
      const ethersService = new EthersService();
      await ethersService.connectWallet();
    },
  },
};
</script>
