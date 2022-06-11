<template>
  <div>
    <v-row>
      <v-col md="4" offset-md="2">
        <v-img
          :src="item.image"
          aspect-ratio="1"
          :class="`rounded-lg mx-auto fill-height${
            isItemBurned ? ' grayscale' : ''
          }`"
        ></v-img>
      </v-col>
      <v-col md="4">
        <span class="text-h3 font-weight-bold">{{ item.name }}</span>

        <v-card class="mt-2" outlined>
          <v-card-title>Price</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="text-h4 text--primary"
                  >{{ item.price | weiToEther }}Ξ</span
                >
              </template>
              <span>{{ item.price | weiToEther }} ether</span>
            </v-tooltip>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!item.sellable && !isThisMyItem && !isItemBurned"
              color="error"
              text
              >Item is Not Sellable</v-btn
            >
            <v-btn v-if="isItemBurned" color="error" text>Item is Burned</v-btn>
            <v-btn
              v-if="!isThisMyItem && !isItemBurned && item.sellable"
              @click="buyItem"
              color="primary"
              >Buy Item</v-btn
            ><v-btn
              v-if="isThisMyItem && !isItemBurned"
              @click="updateItemDialog = true"
              color="primary"
              outlined
              >Update Item</v-btn
            ><v-btn
              v-if="isThisMyItem && !isItemBurned"
              @click="burnDialog = true"
              color="error"
              >Burn</v-btn
            >
          </v-card-actions>
        </v-card>

        <v-card class="mt-2" outlined>
          <v-card-title>Item Log</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-simple-table height="200" fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Type</th>
                    <th class="text-left">From</th>
                    <th class="text-left">To</th>
                    <th class="text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in item.logs" :key="log.id">
                    <td>{{ log.type }}</td>
                    <td>
                      <router-link
                        :to="{
                          name: 'User',
                          params: { id: log.from.walletAddress },
                        }"
                        class="text-decoration-none"
                        >{{
                          log.from.walletAddress.toLowerCase() ===
                          ETHERS_CONNECTED_ACCOUNT.toLowerCase()
                            ? "you"
                            : log.from.username !== null
                            ? log.from.username
                            : log.from.walletAddress.slice(0, 6)
                        }}</router-link
                      >
                    </td>
                    <td>
                      <router-link
                        :to="{
                          name: 'User',
                          params: { id: log.to.walletAddress },
                        }"
                        class="text-decoration-none"
                        >{{
                          log.to.walletAddress.toLowerCase() ===
                          ETHERS_CONNECTED_ACCOUNT.toLowerCase()
                            ? "you"
                            : log.to.username !== null
                            ? log.to.username
                            : log.to.walletAddress.slice(0, 6)
                        }}</router-link
                      >
                    </td>
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <a
                            v-bind="attrs"
                            v-on="on"
                            :href="`https://rinkeby.etherscan.io/tx/${log.hash}`"
                            >{{ log.createdAt | parseDate }}</a
                          >
                        </template>
                        <span>{{ log.createdAt | parseDateWithTime }}</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" offset-md="2"
        ><v-card class="mx-auto mt-2" outlined>
          <v-card-title>Description</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span class="text--disabled"
              >Owned by
              <a href="#" class="text-decoration-none">
                {{
                  isThisMyItem
                    ? "you"
                    : item.user.username || item.user.walletAddress.slice(0, 6)
                }}</a
              ></span
            >
            <p class="text--primary mt-2">
              {{ item.description }}
            </p>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>

    <modal
      v-model="burnDialog"
      :loading="burnDialogLoading"
      :handler="burn"
      :persistent="burnDialogLoading"
      title="Burn Item?"
      description="This action is irreversible. Burning this item means the record won't be held in our smart contract anymore."
      textButton="Burn"
    />

    <v-dialog
      v-model="updateItemDialog"
      max-width="350"
      :persistent="updateItemLoading"
    >
      <v-card>
        <v-card-title class="headline"> Update Item </v-card-title>
        <v-divider />

        <v-card-text class="mt-8">
          <v-text-field
            v-model="form.price"
            :disabled="updateItemLoading"
            label="Price"
            suffix="Ξ"
            type="number"
            outlined
          />
          <v-text-field
            v-model="form.royalty"
            :disabled="updateItemLoading"
            label="Royalty"
            suffix="%"
            type="number"
            outlined
          />
          <v-switch v-model="form.sellable" :disabled="updateItemLoading" inset>
            <template v-slot:label> Set as a sellable item </template>
          </v-switch>
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            @click="updateItem"
            :loading="updateItemLoading"
            text
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import { ethers, BigNumber } from "ethers";
import ItemService from "../services/item";
import EthersService from "../services/ethers";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";
import Modal from "../components/Modal.vue";

export default {
  name: "ItemDetail",
  components: {
    Modal,
  },
  data: () => ({
    item: {
      price: 0,
      image: "",
      user: {
        walletAddress: "",
        username: "",
      },
    },
    form: {
      price: 0,
      royalty: 0,
      sellable: false,
    },
    burnDialog: false,
    burnDialogLoading: false,
    updateItemDialog: false,
    updateItemLoading: false,
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
    dataId() {
      return this.$route.params.id;
    },
    isThisMyItem() {
      return (
        this.item.user.walletAddress.toLowerCase() ===
        this[ETHERS_CONNECTED_ACCOUNT].toLowerCase()
      );
    },
    nullAddress() {
      return ethers.constants.AddressZero;
    },
    isItemBurned() {
      return this.item.user.walletAddress === this.nullAddress;
    },
  },
  filters: {
    weiToEther(price) {
      return ethers.utils.formatEther(price);
    },
    parseDate(date) {
      return format(new Date(date), "MM/dd/yyyy");
    },
    parseDateWithTime(date) {
      return format(new Date(date), "MM/dd/yyyy HH:mm:ss");
    },
  },
  created() {
    this.getItem();
  },
  methods: {
    async getItem() {
      const item = await ItemService.find(this.dataId);
      this.item = item.data.data;
      this.form.price = ethers.utils.formatEther(this.item.price);
      this.form.royalty = this.item.royalty / 100;
      this.form.sellable = this.item.sellable;
    },
    async buyItem() {
      const ethersService = new EthersService();
      const item = await ethersService.getMarketItem(this.item.id);
      const marketItem = this.transformMarketItem(item);
      let price = BigNumber.from(marketItem.price);
      const ONE_HUNDRED_PERCENT = 10000;
      if (marketItem.creator !== marketItem.owner) {
        price = price
          .add(price.mul(marketItem.royalty).div(ONE_HUNDRED_PERCENT))
          .toString();
      }
      ethersService.buyItem(this.item.id, true, price);
    },
    transformMarketItem(marketItem) {
      return {
        tokenId: parseInt(marketItem.tokenId),
        creator: marketItem.creator,
        owner: marketItem.owner,
        price: marketItem.price,
        royalty: parseInt(marketItem.royalty),
        sellable: marketItem.sellable,
      };
    },
    async burn() {
      this.burnDialogLoading = true;
      try {
        this.$socket.client.emit(`join-room`, `burn-${this.dataId}`);
        const ethersService = new EthersService();
        await ethersService.burnItem(parseInt(this.dataId));

        const _this = this;
        this.$socket.$subscribe("burn", () => {
          _this.burnDialog = false;
          _this.burnDialogLoading = false;
          _this.getItem();
        });
      } catch (error) {
        this.$root.showSnackbar(error.message, "error");
        this.burnDialogLoading = false;
      }
    },
    async updateItem() {
      this.updateItemLoading = true;
      try {
        this.$socket.client.emit(`join-room`, `update-item-${this.dataId}`);
        const ethersService = new EthersService();
        await ethersService.updateItem(
          this.item.id,
          ethers.utils.parseEther(this.form.price),
          parseInt(this.form.royalty) * 100,
          this.form.sellable
        );

        const _this = this;
        this.$socket.$subscribe("update-item", () => {
          _this.updateItemDialog = false;
          _this.updateItemLoading = false;
          _this.getItem();
        });
      } catch (error) {
        this.updateItemLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.grayscale {
  filter: gray;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
</style>
