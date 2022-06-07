<template>
  <div>
    <v-row class="fill-height">
      <v-col md="4" cols="12" offset-md="2">
        <h1>Update Profile</h1>
        <v-form @submit.prevent="update" class="mt-2">
          <v-text-field
            v-model="username"
            :disabled="updateLoading"
            label="Username"
            counter="15"
            outlined
          />
          <v-text-field
            v-model="twitterHandle"
            :disabled="updateLoading"
            label="Twitter Handle"
            counter="15"
            prefix="@"
            outlined
          />
          <v-text-field
            v-model="website"
            :disabled="updateLoading"
            type="url"
            label="Website"
            outlined
          />
          <v-textarea
            v-model="bio"
            :disabled="updateLoading"
            label="Bio"
            rows="3"
            outlined
          />
          <v-btn @click="update" :loading="updateLoading" color="primary">
            Update
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
import { mapGetters } from "vuex";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";
import UserService from "@/services/user";

export default {
  name: "UpdateProfile",
  data: () => ({
    username: null,
    twitterHandle: null,
    website: null,
    bio: null,
    updateLoading: false,
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
  },
  mounted() {
    this.getUserProfile();
  },
  methods: {
    async update() {
      this.updateLoading = true;
      try {
        const { username, twitterHandle, website, bio } = this;
        await UserService.update({
          username,
          twitterHandle,
          website,
          bio,
        });
        this.$router.push({
          name: "User",
          params: { id: this[ETHERS_CONNECTED_ACCOUNT] },
        });
      } finally {
        this.updateLoading = false;
      }
    },
    async getUserProfile() {
      const user = await UserService.find(this[ETHERS_CONNECTED_ACCOUNT]);
      this.username = user.data.data.username;
      this.twitterHandle = user.data.data.twitterHandle;
      this.website = user.data.data.website;
      this.bio = user.data.data.bio;
    },
  },
};
</script>
