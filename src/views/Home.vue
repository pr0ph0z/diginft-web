<template>
  <div class="banner-wrapper">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="7" lg="6" class="d-flex align-center">
          <div class="text-center text-md-left">
            <h1 class="banner-title font-weight-bold white--text">
              Discover, buy, and sell community-based amazing NFTs
            </h1>
            <h4 class="banner-subtitle white--text font-weight-regular">
              DigiNFT is an NFT marketplace used by indie digital illustrator
              artists to publish and sell their works through the Ethereum
              ecosystem
            </h4>
            <div class="mt-16 pt-2">
              <v-btn
                color="white"
                class="mr-0 mr-md-8 mb-5 mb-md-0 btn-custom-md"
                large
                :to="{ name: 'Explore' }"
                elevation="0"
              >
                Explore
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="5" lg="6">
          <v-card max-width="600">
            <router-link :to="{ name: 'ItemDetail', params: { id: item.id } }"
              ><v-img height="250" :src="item.image"
            /></router-link>

            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle
              >Owned by
              {{ item.userAddress.slice(0, 6) }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ItemService from "@/services/item";

export default {
  name: "Home",
  data: () => ({
    item: {
      id: 0,
      image: "",
      name: "",
      userAddress: "",
    },
  }),
  created() {
    this.getRandomItem();
  },
  methods: {
    async getRandomItem() {
      const item = await ItemService.random();
      this.item = item.data.data;
    },
  },
};
</script>

<style scoped>
* {
  overflow: hidden;
}
.banner-title {
  font-size: 72px;
  line-height: 80px;
  margin: 20px 0 15px;
}
.banner-subtitle {
  font-size: 21px;
}
.banner-wrapper {
  background: #607df9;
  padding: 20px 0 20px;
  height: 100vh;
  display: flex;
  align-items: center;
}
@media (max-width: 767px) {
  .banner-title {
    font-size: 29px;
    line-height: 40px;
  }
  .banner-wrapper {
    padding: 90px 0 20px;
  }
}
@media (min-width: 1200px) {
  .banner-subtitle {
    margin-right: 150px;
  }
}
.banner1-component {
  padding: 60px 0;
  background-color: #fdbfa8;
}
.banner1-component .banner1-title {
  font-size: 48px;
  line-height: 50px;
  margin: 20px 0 15px;
}
@media (max-width: 991px) {
  .banner1-component .banner1-title {
    font-size: 35px;
  }
}
.banner2-component {
  padding: 145px 0;
}
.banner2-component .banner2-title {
  line-height: 50px;
  font-size: 36px;
  margin: 20px 0 15px;
}
@media (max-width: 991px) {
  .banner2-component {
    padding: 45px 0;
  }
  .banner2-component .banner2-title {
    font-size: 32px;
  }
}
.formbanner1-component {
  max-height: 700px;
  background-color: #e9f3f8;
}
.formbanner1-component .formbanner1-title {
  font-size: 48px;
  line-height: 1;
  letter-spacing: -1px;
  margin: 20px 0 15px;
}
.stylish-input-group {
  display: flex;
  align-items: center;
}
.stylish-input-group .v-text-field__details {
  display: none;
}
.stylish-input-group .v-input__slot {
  margin-bottom: 0;
  border-radius: 36px 0 0 36px !important;
  text-indent: 35px;
  font-weight: 300;
  text-overflow: ellipsis;
  min-height: 72px;
  padding-left: 32px !important;
}
.stylish-input-group
  .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: -5px 0 30px 0 rgba(0, 0, 0, 0.05);
}
.stylish-input-group .v-btn {
  border-radius: 0 36px 36px 0;
  height: 72px !important;
  padding: 0 30px !important;
}
@media (max-width: 991px) {
  .formbanner1-component .formbanner1-title {
    font-size: 39px;
    line-height: 42px;
  }
}
@media (max-width: 767px) {
  .stylish-input-group .v-input__slot {
    min-height: 60px;
    padding-left: 20px !important;
  }
  .stylish-input-group .v-btn {
    height: 60px !important;
  }
}
</style>
