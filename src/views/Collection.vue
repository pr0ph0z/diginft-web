<template>
  <div>
    <v-row class="mb-2">
      <v-col cols="12" md="8">
        <h1>
          {{
            isSearchSubmitted
              ? `Search Collections Result for "${search}"`
              : "Community Collections"
          }}
        </h1>
      </v-col>
      <v-col cols="10" md="4">
        <v-text-field
          v-model="search"
          @click:clear="clearSearch"
          @click:append-outer="searchCollections"
          append-outer-icon="mdi-magnify"
          label="Search Collections"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-4" v-masonry>
      <v-col
        v-for="collection in collections"
        :key="collection.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card max-width="600">
          <v-img
            @load="redrawVueMasonry"
            height="250"
            :src="collection.image"
          />

          <v-card-title>{{ collection.name }}</v-card-title>
          <v-card-subtitle
            >Collection by
            <router-link
              class="text-decoration-none"
              :to="{ name: 'User', params: { id: collection.userAddress } }"
              >{{
                isThisMyItem(collection.userAddress)
                  ? "you"
                  : collection.user.username !== null
                  ? collection.user.username
                  : collection.userAddress.slice(0, 6)
              }}</router-link
            >
          </v-card-subtitle>

          <v-card-text>
            <div>
              {{ collection.description }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              :to="{ name: 'CollectionDetail', params: { id: collection.id } }"
              outlined
            >
              Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col> </v-row
    ><v-fab-transition>
      <v-btn
        :to="{ name: 'CreateCollection' }"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        style="bottom: 0; position: absolute; margin: 0 0 16px 16px"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CollectionService from "../services/collection";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";

export default {
  name: "Collection",
  data: () => ({
    collections: [],
    search: "",
    isSearchSubmitted: false,
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
  },
  created() {
    this.getCollections();
  },
  methods: {
    async getCollections(search = null) {
      this.collections = [];
      const collections = await CollectionService.get(search);
      this.collections = collections.data.data;
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
    isThisMyItem(userAddress) {
      return (
        userAddress.toLowerCase() ===
        this[ETHERS_CONNECTED_ACCOUNT].toLowerCase()
      );
    },
    async clearSearch() {
      this.isSearchSubmitted = false;
      await this.getCollections(null);
    },
    async searchCollections() {
      this.isSearchSubmitted = true;
      await this.getCollections(this.search);
    },
  },
};
</script>
