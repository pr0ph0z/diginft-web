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

    <v-btn
      v-if="ETHERS_IS_ACCOUNT_CONNECTED"
      :to="{ name: 'Collection' }"
      class="mx-2"
      color="primary"
      text
    >
      Collection
    </v-btn>

    <v-btn
      v-if="ETHERS_IS_ACCOUNT_CONNECTED"
      :to="{ name: 'Mint' }"
      class="mx-2"
      color="primary"
      text
    >
      Create
    </v-btn>

    <v-btn @click="profileButton" color="primary" outlined text>
      <span
        :class="`${
          ETHERS_IS_ACCOUNT_CONNECTED ? 'success' : 'warning'
        }--text mr-2 mx-auto`"
        >●</span
      ><span class="d-none d-sm-flex">{{
        ETHERS_CONNECTED_ACCOUNT_ELLIPSIS
      }}</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ETHERS,
  ETHERS_CONNECTED_ACCOUNT,
  ETHERS_CONNECTED_ACCOUNT_ELLIPSIS,
  ETHERS_IS_ACCOUNT_CONNECTED,
} from "../store/actions/ethers";
import EthersService from "../services/ethers";

export default {
  name: "Navbar",
  computed: {
    ...mapGetters(ETHERS, [
      ETHERS_CONNECTED_ACCOUNT,
      ETHERS_CONNECTED_ACCOUNT_ELLIPSIS,
      ETHERS_IS_ACCOUNT_CONNECTED,
    ]),
  },
  methods: {
    async profileButton() {
      if (this[ETHERS_IS_ACCOUNT_CONNECTED]) {
        return this.toUserPage();
      }
      return await this.connectWallet();
    },
    async connectWallet() {
      const ethersService = new EthersService();
      await ethersService.connectWallet();
    },
    toUserPage() {
      this.$router.push({
        name: "User",
        params: { id: this[ETHERS_CONNECTED_ACCOUNT] },
      });
    },
  },
};
</script>
