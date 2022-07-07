<template>
  <div>
    <v-row class="fill-height">
      <v-col md="3" cols="12" offset-md="2">
        <div class="d-flex justify-center">
          <v-img
            :aspect-ratio="1 / 1"
            :src="collection.image"
            class="rounded-circle"
            max-width="250"
          />
        </div>
        <div class="d-flex flex-inline align-center justify-center">
          <h1 class="text-center my-4 mb-0">
            {{ collection.name }}
          </h1>
          <v-btn
            v-if="
              collection.userAddress.toLowerCase() ===
              ETHERS_CONNECTED_ACCOUNT.toLowerCase()
            "
            :to="{ name: 'UpdateCollection', params: { id: collection.id } }"
            class="d-flex align-center ml-2"
            icon
            color="grey lighten-1"
            x-small
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="
              collection.userAddress.toLowerCase() ===
              ETHERS_CONNECTED_ACCOUNT.toLowerCase()
            "
            @click="deleteDialog = true"
            class="d-flex align-center ml-2"
            icon
            color="grey lighten-1"
            x-small
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
        <p class="text--disabled text-center" style="word-wrap: break-word">
          {{ collection.description }}
        </p>
        <div class="d-flex justify-center">
          <v-sheet class="rounded-lg" outlined>
            <v-row class="stats" no-gutters>
              <v-col class="pa-4 stats-item text-center">
                <p class="text-h6 mb-0">{{ collection.items.length }}</p>
                <p class="mb-0">items</p>
              </v-col>
            </v-row>
          </v-sheet>
        </div>
      </v-col>
      <v-col md="7" class="d-sm-flex">
        <v-divider class="d-sm-flex d-none" vertical />
        <v-row class="ml-2" v-masonry>
          <v-col
            class="ml-auto mr-auto"
            v-for="item in collection.items"
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
      </v-col> </v-row
    ><v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Delete collection? </v-card-title>

        <v-card-text>
          This action is irreversible. Deleting this data means other data that
          containing this data will also be deleted.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="error darken-1"
            @click="deleteCollection"
            :loading="deleteDialogLoading"
            text
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Item from "@/components/Item.vue";
import CollectionService from "@/services/collection";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";

export default {
  name: "CollectionDetail",
  data: () => ({
    collection: {
      name: "",
      description: "",
      image: "",
      userAddress: "",
      items: [],
    },
    items: [],
    deleteDialog: false,
    deleteDialogLoading: false,
  }),
  components: {
    Item,
  },
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
    id() {
      return this.$route.params.id;
    },
  },
  mounted() {
    this.getDetailedCollection();
  },
  methods: {
    async getDetailedCollection() {
      const collection = await CollectionService.find(this.id);
      this.collection = collection.data.data;
    },
    redrawVueMasonry() {
      this.$redrawVueMasonry();
    },
    async deleteCollection() {
      this.deleteDialogLoading = true;
      try {
        await CollectionService.delete(this.id);
        this.$router.push({ name: "Collection" });
      } finally {
        this.deleteDialogLoading = false;
      }
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
