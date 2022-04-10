<template>
  <div v-if="isLandscape && this.$vuetify.display.mdAndUp">
    <v-navigation-drawer permanent left app style="width: 40% !important">
      <v-list>
        <v-list-item
          v-for="(r, index) in restaurants"
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
    <v-list>
      <v-list-item
        v-for="(r, index) in restaurants"
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
import { getToken, getMessaging, onMessage } from "firebase/messaging";
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
    chosenRestaurantId: "",
    isLandscape: false,
  }),
  methods: {
    async getAllRestaurants() {
      this.restaurants = await getRestaurants();
      this.restaurants.map((r) => {
        let dollars = "";
        for (let i = 0; i < r.priceLevel; i++) {
          dollars += "$";
        }
        r.priceLevel = dollars;
      });
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
    async activate() {
      getToken(messaging, {
        vapidKey:
          "BKMetiMUvVfMeO7BY1sYllLWcTBK-sVr456aMlYjt49jmNJodpBB42GUXX8IvYSkSwk1gcx0dNBJzyxjqcJau3U",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log(currentToken);
            // Send the token to your server and update the UI if necessary
            // ...
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });
      if (token) console.log(token);
      else console.log("Did not work");
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onScreenResize);
    });
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log(payload);
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
