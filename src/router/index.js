import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Explore from "../views/Explore.vue";
import ItemDetail from "../views/ItemDetail.vue";
import Mint from "../views/Mint.vue";
import User from "../views/User.vue";
import UpdateProfile from "../views/UpdateProfile.vue";
import Collection from "../views/Collection.vue";
import CollectionDetail from "../views/CollectionDetail.vue";
import CollectionForm from "../views/CollectionForm.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
  },
  {
    path: "/item/:id",
    name: "ItemDetail",
    component: ItemDetail,
  },
  {
    path: "/mint",
    name: "Mint",
    component: Mint,
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
  },
  {
    path: "/update-profile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/collection",
    name: "Collection",
    component: Collection,
  },
  {
    path: "/collection/:id",
    name: "CollectionDetail",
    component: CollectionDetail,
  },
  {
    path: "/create-collection",
    name: "CreateCollection",
    component: CollectionForm,
  },
  {
    path: "/collection/:id/update",
    name: "UpdateCollection",
    component: CollectionForm,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
