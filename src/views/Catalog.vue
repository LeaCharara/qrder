<template>
  <div v-if="isLandscape && this.$vuetify.display.mdAndUp">
    <v-navigation-drawer permanent left app style="width: 40% !important">
      <v-card>
        <v-text-field
          @keyup="searchRestaurant"
          placeholder="Search"
          v-model="search"
        ></v-text-field>
        <v-tabs center-active show-arrows>
          <v-tab @click="chosenType = 'All'">All</v-tab>
          <v-tab v-for="type in types" :key="type" @click="chosenType = type">{{
            type
          }}</v-tab>
        </v-tabs>
      </v-card>
      <v-list>
        <v-list-item
          v-for="(r, index) in filteredRestaurants"
          :key="index"
          @click="showinfo(r.id)"
        >
          <RestaurantCard :r="r" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="large-screen">
      <RestaurantDescription
        :id="chosenRestaurantId"
        :isLandscape="isLandscape"
      />
    </v-main>
  </div>
  <v-main v-else>
    <v-text-field placeholder="Search" v-model="search">Search</v-text-field>
    <v-card>
      <v-tabs center-active show-arrows>
        <v-tab @click="chosenType = 'All'">All</v-tab>
        <v-tab v-for="type in types" :key="type" @click="chosenType = type">{{
          type
        }}</v-tab>
      </v-tabs>
    </v-card>
    <v-list>
      <v-list-item
        v-for="(r, index) in filteredRestaurants"
        :key="index"
        @click="showinfo(r.id)"
      >
        <RestaurantCard :r="r" />
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script>
import { getRestaurants } from "../server/db.js";
import RestaurantCard from "../components/RestaurantCard.vue";
import RestaurantDescription from "../views/RestaurantDescription.vue";
export default {
  name: "Catalog",
  components: {
    RestaurantCard,
    RestaurantDescription,
  },
  props: {
    BackchosenRestaurantId: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    restaurants: [],
    filteredRestaurants: [],
    chosenRestaurantId: "",
    isLandscape: false,
    search: "",
    types: [],
    chosenType: "All",
  }),
  methods: {
    async getAllRestaurants() {
      this.restaurants = await getRestaurants();
      this.restaurants.map((r) => {
        if (!this.types.includes(r.type)) this.types.push(r.type);
        let dollars = "";
        for (let i = 0; i < r.priceLevel; i++) {
          dollars += "$";
        }
        r.priceLevel = dollars;
      });
      this.filteredRestaurants = [...this.restaurants];
    },
    showinfo(id) {
      if (this.isLandscape && this.$vuetify.display.mdAndUp) {
        this.chosenRestaurantId = id;
      } else {
        this.$router.push({ name: "description", params: { id: id } });
      }
    },
    onScreenResize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
    searchRestaurant() {
      this.filteredRestaurants = this.restaurants.filter((r) => {
        return r.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  watch: {
    chosenType(value) {
      if (value === "All") this.filteredRestaurants = [...this.restaurants];
      else
        this.filteredRestaurants = this.restaurants.filter(
          (r) => r.type === value
        );
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onScreenResize);
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.onScreenResize);
  },
  async created() {
    await this.getAllRestaurants();
    if (this.BackchosenRestaurantId.length === 0)
      this.chosenRestaurantId = this.restaurants[0].id;
    else this.chosenRestaurantId = this.BackchosenRestaurantId;
    this.isLandscape = window.innerWidth > window.innerHeight;
  },
};
</script>

<style lang="scss" scoped>
.v-main.large-screen {
  padding-left: 40% !important;
}
</style>
