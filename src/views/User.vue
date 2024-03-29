<template>
  <div>
    <v-row class="fill-height">
      <v-col md="3" cols="12" offset-md="2">
        <div class="d-flex justify-center">
          <avatar :address="id" class="rounded-circle" width="250" />
        </div>
        <div class="d-flex flex-inline align-center justify-center">
          <h1 class="text-center my-4 mb-0">
            {{ displayName }}
          </h1>
          <a
            v-if="user.twitterVerification !== null"
            :href="user.twitterVerification.tweetUrl"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="d-flex align-center mt-4"
                  icon
                  color="primary lighten-1"
                >
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
              </template>
              <span
                >Twitter verified at
                {{ user.twitterVerification.createdAt }}</span
              >
            </v-tooltip>
          </a>
          <v-btn
            v-if="id.toLowerCase() === ETHERS_CONNECTED_ACCOUNT.toLowerCase()"
            :to="{ name: 'UpdateProfile' }"
            class="d-flex align-center ml-2"
            icon
            color="grey lighten-1"
            x-small
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-inline justify-center mb-2">
          <a
            v-if="user.twitterHandle !== null"
            :href="`https://twitter.com/${user.twitterHandle}`"
          >
            <v-icon> mdi-twitter </v-icon>
          </a>
          <a v-if="user.website !== null" :href="user.website" class="ml-2">
            <v-icon> mdi-web </v-icon>
          </a>
        </div>
        <p
          v-if="hasUserSetUsername"
          class="text--disabled text-center"
          style="word-wrap: break-word"
        >
          {{ user.walletAddress }}
        </p>
        <div class="d-flex justify-center">
          <v-sheet class="rounded-lg" outlined>
            <v-row class="stats" no-gutters>
              <v-col class="pa-4 stats-item text-center">
                <p class="text-h6 mb-0">{{ user.createdItem.length }}</p>
                <p class="mb-0">created</p>
              </v-col>
              <v-col class="pa-4 stats-item text-center">
                <p class="text-h6 mb-0">{{ user.ownedItem.length }}</p>
                <p class="mb-0">owned</p></v-col
              >
              <v-col class="pa-4 stats-item text-center">
                <p class="text-h6 mb-0">{{ user.favoritedItems.length }}</p>
                <p class="mb-0">favorited</p></v-col
              >
            </v-row>
          </v-sheet>
        </div>
        <div class="d-flex justify-center mt-4">
          <v-select
            v-model="filter"
            @change="filterItem"
            :items="['Created', 'Owned', 'Favorited']"
            label="Filter items"
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col md="7" class="d-sm-flex">
        <v-divider class="d-sm-flex d-none" vertical />
        <v-row class="ml-2" v-masonry>
          <v-col
            class="ml-auto mr-auto"
            v-for="item in items"
            :key="item.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <item
              :item="item"
              :redrawVueMasonry="redrawVueMasonry"
              :connectedAccount="ETHERS_CONNECTED_ACCOUNT"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";
import Avatar from "@/components/Avatar";
import Item from "@/components/Item";
import UserService from "@/services/user";

export default {
  name: "User",
  data: () => ({
    user: {
      username: "",
      walletAddress: "",
      createdItem: [],
      ownedItem: [],
      favoritedItems: [],
      twitterVerification: null,
      twitter: null,
    },
    radioGroup: "created",
    items: [],
    filter: "Created",
  }),
  components: {
    Avatar,
    Item,
  },
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
    id() {
      return this.$route.params.id;
    },
    displayName() {
      return this.user.username
        ? this.user.username
        : `${this.user.walletAddress.slice(
            0,
            5
          )}...${this.user.walletAddress.slice(-3)}`;
    },
    hasUserSetUsername() {
      return this.user.username !== null;
    },
  },
  mounted() {
    this.getUserProfile();
  },
  methods: {
    async getUserProfile() {
      const user = await UserService.find(this.id);
      this.user = user.data.data;
      this.filterItem();
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
    filterItem() {
      this.items = [];
      if (this.filter === "Created") {
        this.items = this.user.createdItem;
      }
      if (this.filter === "Owned") {
        this.items = this.user.ownedItem;
      }
      if (this.filter === "Favorited") {
        this.items = this.user.favoritedItems.map(({ item }) => item);
      }
      const _this = this;
      setTimeout(() => {
        _this.redrawVueMasonry();
      }, 50);
    },
  },
};
</script>

<style scoped>
.stats > .stats-item:not(:last-child) {
  border-right: solid 1px rgba(0, 0, 0, 0.1);
}
a {
  color: white !important;
}
</style>
