<template>
  <div>
    <v-row class="fill-height">
      <v-col md="4" cols="12" offset-md="2">
        <h1>Mint an Item</h1>

        <v-form @submit.prevent="mint" class="mt-2">
          <v-text-field
            v-model="name"
            :disabled="mintLoading"
            label="Name"
            outlined
          />
          <v-textarea
            v-model="description"
            :disabled="mintLoading"
            label="Description"
            rows="3"
            outlined
          />
          <v-file-input
            v-model="image"
            :disabled="mintLoading"
            label="Image"
            prepend-icon=""
            outlined
          />
          <v-file-input
            v-model="file"
            :disabled="mintLoading"
            label="Original File (optional)"
            prepend-icon=""
            outlined
          />
          <v-text-field
            v-model="price"
            :disabled="mintLoading"
            label="Price"
            suffix="Ξ"
            type="number"
            outlined
          />
          <v-text-field
            v-model="royalty"
            :disabled="mintLoading"
            label="Royalty"
            suffix="%"
            type="number"
            outlined
          />
          <v-switch v-model="sellable" :disabled="mintLoading" inset>
            <template v-slot:label> Set as a sellable item </template>
          </v-switch>
          <v-btn @click="mint" :loading="mintLoading" color="primary">
            Mint
          </v-btn>
          <span
            v-if="mintLoading"
            class="primary--text font-weight-bold ml-2"
            >{{ mintLoadingText }}</span
          >
        </v-form>
      </v-col>
      <v-col md="4" class="d-none d-sm-flex">
        <v-divider vertical />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { utils } from "ethers";
import { create } from "ipfs-http-client";
import { mapGetters } from "vuex";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";
import EthersService from "../services/ethers";

export default {
  name: "Mint",
  data: () => ({
    name: null,
    description: null,
    image: null,
    file: null,
    price: null,
    royalty: null,
    sellable: true,
    mintLoading: false,
    mintLoadingText: "Minting",
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
  },
  methods: {
    async mint() {
      try {
        this.$socket.client.emit(
          "join-room",
          this[ETHERS_CONNECTED_ACCOUNT].toLowerCase()
        );
        let metadata = { name: this.name, description: this.description };
        this.mintLoading = true;
        const client = create("https://ipfs.infura.io:5001/api/v0");
        this.mintLoadingText = "Uploading image to the IPFS...";
        const image = await client.add(this.image);
        metadata = {
          ...metadata,
          image: `https://ipfs.infura.io/ipfs/${image.path}`,
        };
        if (this.file !== null) {
          this.mintLoadingText = "Uploading file to the IPFS...";
          const file = await client.add(this.file);
          metadata = {
            ...metadata,
            file: `https://ipfs.infura.io/ipfs/${file.path}`,
          };
        }
        this.mintLoadingText = "Uploading metadata to the IPFS...";
        const data = await client.add(JSON.stringify(metadata));

        const ethersService = new EthersService();
        this.mintLoadingText = "Waiting transaction to be accepted...";
        await ethersService.mint(
          `https://ipfs.infura.io/ipfs/${data.path}`,
          utils.parseEther(this.price),
          parseInt(this.royalty) * 10,
          this.sellable
        );
        this.mintLoadingText = "Minting token...";

        const _this = this;
        this.$socket.$subscribe("mint", message => {
          _this.$router.push({ name: "ItemDetail", params: { id: message } });
        });
      } catch (error) {
        this.mintLoading = false;
      }
    },
  },
};
</script>