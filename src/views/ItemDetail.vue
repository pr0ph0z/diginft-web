<template>
  <div>
    <v-row>
      <v-col md="4" offset-md="2">
        <v-img
          :src="item.image"
          aspect-ratio="1"
          class="rounded-lg mx-auto fill-height"
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
            <v-btn @click="buyItem" color="primary">Buy Item</v-btn>
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
                      <a href="#" class="text-decoration-none">{{
                        log.fromAddress.slice(0, 6)
                      }}</a>
                    </td>
                    <td>
                      <a href="#" class="text-decoration-none">{{
                        log.toAddress.slice(0, 6)
                      }}</a>
                    </td>
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{
                            log.createdAt | parseDate
                          }}</span>
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
                  item.user.username || item.user.walletAddress.slice(0, 6)
                }}</a
              ></span
            >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="text-h4 text--primary"
                  >{{ item.price | weiToEther }}Ξ</span
                >
              </template>
              <span>{{ item.price | weiToEther }} ether</span>
            </v-tooltip>
            <p class="text--primary">
              {{ item.description }}
            </p>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
  </div>
</template>

<script>
import { format } from "date-fns";
import { ethers, BigNumber } from "ethers";
import ItemService from "../services/item";
import EthersService from "../services/ethers";

export default {
  name: "ItemDetail",
  data: () => ({
    item: {
      price: 0,
      image: "",
      user: {
        walletAddress: "",
        username: "",
      },
    },
  }),
  computed: {
    dataId() {
      return this.$route.params.id;
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
    },
    async buyItem() {
      const ethersService = new EthersService();
      const item = await ethersService.getMarketItem(this.item.id);
      const marketItem = this.transformMarketItem(item);
      let price = BigNumber.from(marketItem.price);
      const ONE_HUNDRED_PERCENT = 10000;
      if (marketItem.seller !== marketItem.owner) {
        price = price
          .add(price.mul(marketItem.royalty).div(ONE_HUNDRED_PERCENT))
          .toString();
      }
      ethersService.buyItem(this.item.id, true, price);
    },
    transformMarketItem(marketItem) {
      return {
        tokenId: parseInt(marketItem.tokenId),
        seller: marketItem.seller,
        owner: marketItem.owner,
        price: marketItem.price,
        royalty: parseInt(marketItem.royalty),
        sellable: marketItem.sellable,
      };
    },
  },
};
</script>
