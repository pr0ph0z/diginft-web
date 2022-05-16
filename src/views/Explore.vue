<template>
  <v-row class="mt-4" v-masonry>
    <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="2">
      <v-card max-width="300">
        <v-img height="250" :src="item.image" />

        <v-card-title>{{ item.name }}</v-card-title>

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
          <v-btn color="deep-purple lighten-2" text> Reserve </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ethers } from "ethers";
import ItemService from "../services/item";

export default {
  name: "Explore",
  data: () => ({
    items: [],
  }),
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
  },
};
</script>
