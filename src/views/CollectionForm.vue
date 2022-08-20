<template>
  <div>
    <v-row class="fill-height">
      <v-col md="4" cols="12" offset-md="2">
        <h1>Create a Collection</h1>

        <v-form @submit.prevent="create" class="mt-2">
          <v-text-field
            v-model="name"
            :disabled="loading"
            label="Name"
            outlined
          />
          <v-textarea
            v-model="description"
            :disabled="loading"
            label="Description"
            rows="3"
            outlined
          />
          <v-img
            v-if="typeof image === 'string'"
            :src="image"
            max-width="200"
            class="mb-4 text-center"
          />
          <v-file-input
            v-model="image"
            :disabled="loading"
            label="Image"
            prepend-icon=""
            outlined
          />
          <v-btn @click="submit" :loading="loading" color="primary">
            {{ id !== undefined ? "Update" : "Create" }}
          </v-btn>
        </v-form>
      </v-col>
      <v-col md="4" class="d-none d-sm-flex">
        <v-divider vertical />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { create } from "ipfs-http-client";
import CollectionService from "../services/collection";

export default {
  name: "CollectionForm",
  data: () => ({
    name: null,
    description: null,
    image: null,
    loading: false,
  }),
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  created() {
    if (this.id !== undefined) {
      this.findCollection();
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        let image = null;
        if (this.image !== null && typeof this.image !== "string") {
          const auth = `Basic ${Buffer.from(
            `${process.env.VUE_APP_INFURA_PROJECT_ID}:${process.env.VUE_APP_INFURA_KEY_SECRET}`
          ).toString("base64")}`;
          const client = create({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
              authorization: auth,
            },
          });
          image = await client.add(this.image);
        }
        if (this.id !== undefined) {
          await CollectionService.update(this.id, {
            name: this.name,
            description: this.description,
            ...(image !== null && {
              image: `https://diginft.infura-ipfs.io/ipfs/${image.path}`,
            }),
          });
        } else {
          await CollectionService.create({
            name: this.name,
            description: this.description,
            image: `https://diginft.infura-ipfs.io/ipfs/${image.path}`,
          });
        }

        this.$router.push({ name: "Collection" });
      } catch (error) {
        this.loading = false;
      }
    },
    async findCollection() {
      const collection = await CollectionService.find(this.id);
      this.name = collection.data.data.name;
      this.description = collection.data.data.description;
      this.image = collection.data.data.image;
    },
  },
};
</script>
