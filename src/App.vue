<template>
  <v-app>
    <navbar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
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
    await ethersService.connectWallet();
    eth.on("accountsChanged", async accounts => {
      if (accounts.length === 0) {
        this[ETHERS_SET_ACCOUNT](null);
      }
    });
  },
  methods: {
    ...mapActions(ETHERS, [ETHERS_SET_ACCOUNT]),
  },
};
</script>
