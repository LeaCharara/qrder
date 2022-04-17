<template>
  <div v-if="isLandscape && this.$vuetify.display.mdAndUp">
    <v-navigation-drawer permanent left app style="width: 40% !important">
      <v-list v-if="sortedOrders.length > 0">
        <v-list-item v-for="(o, index) in sortedOrders" :key="index">
          <div class="order">
            <v-card
              class="order-card"
              :elevation="1"
              outlined
              style="padding: 20px; margin-top: 20px"
            >
              <OrderCard
                :order="o"
                :isLandscape="isLandscape.toString()"
                @updateChosenOrder="updateChosenOrder"
              />
            </v-card>
          </div>
        </v-list-item>
      </v-list>
      <div v-else>
        <h2>No orders yet</h2>
      </div>
    </v-navigation-drawer>
    <v-main class="large-screen">
      <OrderRecap
        :order="chosenOrder"
        :fromOrders="'true'"
        :isLandscape="'true'"
      />
    </v-main>
  </div>
  <div v-else>
    <v-list v-if="sortedOrders.length > 0">
      <v-list-item v-for="(o, index) in sortedOrders" :key="index">
        <div class="order">
          <v-card
            class="order-card"
            :elevation="1"
            outlined
            style="padding: 20px; margin-top: 20px"
          >
            <OrderCard :order="o" />
          </v-card>
        </div>
      </v-list-item>
    </v-list>
    <div v-else>
      <h2>No orders yet</h2>
    </div>
  </div>
</template>

<script>
import { getOrders, getOrderDetail } from "../server/db.js";
import OrderCard from "../components/OrderCard.vue";
import OrderRecap from "../views/OrderRecap.vue";
export default {
  name: "Orders",
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    sortedOrders: function () {
      function compare(a, b) {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      }

      return this.orders.sort(compare);
    },
  },
  components: {
    OrderCard,
    OrderRecap,
  },

  data: () => ({
    orders: [],
    isLandscape: false,
    chosenOrder: "",
  }),
  methods: {
    async getAllOrders() {
      this.orders = await getOrders(window.localStorage.getItem("userId"));
    },
    updateChosenOrder(obj) {
      this.chosenOrder = obj.order;
    },
    onScreenResize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
  },
  async created() {
    this.isLandscape = window.innerWidth > window.innerHeight;
    if (!window.localStorage.getItem("userId")) 
      this.$router.push({ name: "login", params: { fromOrders: "true" } });
    await this.getAllOrders();
    if(this.orders.length > 0){
      const itemDetails = await getOrderDetail(this.orders[0].id);
    this.chosenOrder = JSON.stringify(itemDetails);
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onScreenResize);
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.onScreenResize);
  },
};
</script>

<style scoped>
.order {
  width: 100%;
}
@media screen and (min-width: 780px) {
  .order-card {
    max-height: 270px;
  }
}
.v-main.large-screen {
  padding-left: 40% !important;
}
</style>
