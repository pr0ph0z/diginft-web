<template>
  <v-card max-width="600">
    <v-img
      @load="redrawVueMasonry"
      height="250"
      :class="`${item.userAddress === nullAddress ? 'grayscale' : null}`"
      :src="item.image"
    />

    <v-card-title
      >{{ item.name }}
      <v-chip
        v-if="item.userAddress !== nullAddress"
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
        isThisMyItem(item.userAddress) ? "you" : item.userAddress.slice(0, 6)
      }}
    </v-card-subtitle>

    <v-card-text>
      <div>
        {{ item.description }}
      </div>
    </v-card-text>

    <v-btn v-if="item.userAddress === nullAddress" disabled text
      >Item is Burned</v-btn
    >
    <v-tooltip v-else bottom>
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
</template>

<script>
import { ethers, utils } from "ethers";

export default {
  name: "Item",
  props: {
    item: {
      id: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
        default: "",
      },
      userAddress: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: "",
      },
      sellable: {
        type: Boolean,
        default: false,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    redrawVueMasonry: {
      type: Function,
    },
    connectedAccount: {
      type: String,
      default: "",
    },
  },
  filters: {
    weiToEther(price) {
      return utils.formatEther(price);
    },
  },
  computed: {
    nullAddress() {
      return ethers.constants.AddressZero;
    },
  },
  methods: {
    isThisMyItem() {
      return (
        this.item.userAddress.toLowerCase() ===
        this.connectedAccount.toLowerCase()
      );
    },
  },
};
</script>
