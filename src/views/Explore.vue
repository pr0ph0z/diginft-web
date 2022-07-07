<template>
  <div>
    <h1>Explore Latest Art</h1>
    <v-row class="mt-4" v-masonry>
      <v-col
        v-for="item in items"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <item
          :item="item"
          :redrawVueMasonry="redrawVueMasonry"
          :connectedAccount="ETHERS_CONNECTED_ACCOUNT"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Item from "@/components/Item";
import ItemService from "../services/item";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";

export default {
  name: "Explore",
  data: () => ({
    items: [],
  }),
  components: {
    Item,
  },
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      const items = await ItemService.get();
      this.items = items.data.data;
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
  },
};
</script>
