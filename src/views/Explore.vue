<template>
  <v-row class="mt-4" v-masonry>
    <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
      <v-card max-width="400">
        <v-img @load="redrawVueMasonry" height="250" :src="item.image" />

        <v-card-title
          >{{ item.name }}
          <v-chip
            class="ma-2"
            :color="item.sellable ? 'green' : 'error'"
            text-color="white"
            small
          >
            {{ item.sellable ? "Sellable" : "Not sellable" }}
          </v-chip></v-card-title
        >
        <v-card-subtitle
          >Owned by
          {{
            isThisMyItem(item.userAddress)
              ? "you"
              : item.userAddress.slice(0, 6)
          }}
        </v-card-subtitle>

        <v-card-text>
          <div>
            {{ item.description }}
          </div>
        </v-card-text>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" class="text-h6 pa-4"
              >{{ item.price | weiToEther }}Ξ</span
            >
          </template>
          <span>{{ item.price | weiToEther }} ether</span>
        </v-tooltip>

        <v-card-actions>
          <v-btn
            color="primary"
            :to="{ name: 'ItemDetail', params: { id: item.id } }"
            outlined
          >
            Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import ItemService from "../services/item";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";

export default {
  name: "Explore",
  data: () => ({
    items: [],
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
  },
  created() {
    this.getItems();
  },
  filters: {
    weiToEther(price) {
      return ethers.utils.formatEther(price);
    },
  },
  methods: {
    async getItems() {
      const items = await ItemService.get();
      this.items = items.data.data;
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
    isThisMyItem(userAddress) {
      return (
        this[ETHERS_CONNECTED_ACCOUNT].toLowerCase() ===
        userAddress.toLowerCase()
      );
    },
  },
};
</script>
