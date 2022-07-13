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
            :color="
              isTwitterVerified
                ? isVerifiedTwitterAccountFormChanged
                  ? 'warning'
                  : 'success'
                : 'warning'
            "
            :hint="
              isTwitterVerified
                ? isVerifiedTwitterAccountFormChanged
                  ? 'Changing your Twitter handle means you\'ll lose the verification'
                  : 'Your Twitter account is already verified'
                : 'Your Twitter account hasn\'t verified yet'
            "
            outlined
            ><template v-slot:append-outer>
              <v-btn
                @click="verificationDialog = true"
                :disabled="!isVerifiedTwitterAccountFormChanged"
                color="primary"
                >Verify</v-btn
              >
            </template>
          </v-text-field>
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

    <v-dialog
      v-model="verificationDialog"
      max-width="500"
      :persistent="verificationLoading"
    >
      <v-card>
        <v-card-title class="headline"> Verify Your Twitter </v-card-title>
        <v-divider />

        <v-card-text class="mt-8">
          <v-text-field
            v-model="twitterHandle"
            :disabled="handleTwitterSubmitted"
            label="Twitter Handle"
            counter="15"
            prefix="@"
            outlined
            ><template v-slot:append-outer>
              <v-btn
                @click="submitTwitterHandle"
                :disabled="handleTwitterSubmitted"
                color="primary"
                >Submit</v-btn
              >
            </template>
          </v-text-field>

          <v-textarea
            v-model="signaturePrompt"
            :disabled="disableSignaturePrompt"
            label="Signature Prompt"
            rows="4"
            outlined
            ><template v-slot:append-outer>
              <v-btn
                @click="signPrompt"
                :disabled="disableSignaturePrompt"
                color="primary"
                max-width="91"
                >Sign</v-btn
              >
            </template>
          </v-textarea>

          <v-textarea
            v-model="tweetMessageText"
            :disabled="disableTweetButton"
            label="Tweet Message"
            outlined
            readonly
            ><template v-slot:append-outer>
              <div class="text-center">
                <v-btn
                  @click="tweetSignedPrompt"
                  :disabled="disableTweetButton"
                  color="primary"
                  max-width="91"
                  >Tweet</v-btn
                >
                <v-btn
                  @click="tweetSent = true"
                  :disabled="disableTweetButton"
                  class="mt-2"
                  color="primary"
                  max-width="91"
                  >Done</v-btn
                >
              </div>
            </template>
          </v-textarea>
          <v-text-field
            v-model="tweetUrl"
            :disabled="disableVerifyButton"
            label="Tweet URL"
            hint="ex: https://twitter.com/username/status/1528418766102876160"
            type="url"
            outlined
            ><template v-slot:append-outer>
              <v-btn
                @click="verifyTwitter"
                :disabled="disableVerifyButton"
                :loading="verifySent"
                color="primary"
                >Verify</v-btn
              >
            </template>
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ETHERS, ETHERS_CONNECTED_ACCOUNT } from "../store/actions/ethers";
import EthersService from "@/services/ethers";
import UserService from "@/services/user";

export default {
  name: "UpdateProfile",
  data: () => ({
    username: null,
    twitterHandle: null,
    website: null,
    bio: null,
    updateLoading: false,
    verificationDialog: false,
    verificationLoading: false,
    signaturePrompt: "",
    handleTwitterSubmitted: false,
    promptSigned: false,
    tweetMessageText: "",
    tweetSent: false,
    tweetUrl: "",
    verifySent: false,
    isTwitterVerified: false,
    verifiedTwitterAccount: "",
  }),
  computed: {
    ...mapGetters(ETHERS, [ETHERS_CONNECTED_ACCOUNT]),
    disableSignaturePrompt() {
      if (!this.handleTwitterSubmitted) {
        return true;
      }

      if (this.promptSigned) {
        return true;
      }

      return false;
    },
    disableTweetButton() {
      if (!this.handleTwitterSubmitted) {
        return true;
      }

      if (!this.promptSigned) {
        return true;
      }

      if (this.tweetSent) {
        return true;
      }

      return false;
    },
    disableVerifyButton() {
      if (!this.handleTwitterSubmitted) {
        return true;
      }

      if (!this.promptSigned) {
        return true;
      }

      if (!this.tweetSent) {
        return true;
      }

      if (this.verifySent) {
        return true;
      }

      return false;
    },
    isVerifiedTwitterAccountFormChanged() {
      return this.twitterHandle !== this.verifiedTwitterAccount;
    },
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
      this.isTwitterVerified = user.data.data.twitterVerification !== null;
      if (user.data.data.twitterVerification !== null) {
        this.verifiedTwitterAccount = user.data.data.twitterHandle;
      }
    },
    submitTwitterHandle() {
      this.handleTwitterSubmitted = true;
      this.signaturePrompt = `I am attesting that this twitter @${this.twitterHandle} is linked to the Ethereum account ${this[ETHERS_CONNECTED_ACCOUNT]} for DigiNFT`;
    },
    async signPrompt() {
      const ethersService = new EthersService();
      const signer = ethersService.provider.getSigner();
      const signature = await signer.signMessage(this.signaturePrompt);
      this.tweetMessageText = `${this.signaturePrompt}\n\nsig:${signature}`;
      this.promptSigned = true;
    },
    tweetSignedPrompt() {
      window
        .open(
          `https://twitter.com/intent/tweet?&text=${encodeURIComponent(
            this.tweetMessageText
          )}`,
          "_blank"
        )
        .focus();
    },
    async verifyTwitter() {
      this.verifySent = true;
      try {
        await UserService.verifyTwitter({
          twitterHandle: this.twitterHandle,
          tweetUrl: this.tweetUrl,
        });

        this.$router.push({
          name: "User",
          params: { id: this[ETHERS_CONNECTED_ACCOUNT] },
        });
      } finally {
        this.verifySent = false;
      }
    },
  },
};
</script>
