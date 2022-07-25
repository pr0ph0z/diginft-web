<template>
  <div>
    <v-row class="mb-2">
      <v-col cols="12" md="8">
        <h1>
          {{
            isSearchSubmitted
              ? `Search Items Result for "${search}"`
              : "Explore Latest Art"
          }}
        </h1>
      </v-col>
      <v-col cols="10" md="4">
        <v-text-field
          v-model="search"
          @click:clear="clearSearch"
          @click:append-outer="searchItems"
          append-outer-icon="mdi-magnify"
          label="Search Items"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
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
    search: "",
    isSearchSubmitted: false,
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
    async getItems(search = null) {
      this.items = [];
      const items = await ItemService.get(search);
      this.items = items.data.data;
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
    async clearSearch() {
      this.isSearchSubmitted = false;
      await this.getItems(null);
    },
    async searchItems() {
      this.isSearchSubmitted = true;
      await this.getItems(this.search);
    },
  },
};
</script>
