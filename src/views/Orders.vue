<template>
  <v-list>
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
</template>

<script>
import { getOrders } from "../server/db.js";
import OrderCard from "../components/OrderCard.vue";
export default {
  name: "Orders",
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    sortedOrders: function() {
      function compare(a, b) {
        if (a.date < b.date)
          return 1;
        if (a.date > b.date)
          return -1;
        return 0;
      }

      return this.orders.sort(compare);
    }
  },
  components: {
    OrderCard,
  },
  
  data: () => ({
    orders :[]
  }),
  methods: {
    async getAllOrders() {
      this.orders = await getOrders(window.localStorage.getItem('userId'));
    },
  },
  async created() {
    await this.getAllOrders();
  },
};
</script>

<style scoped>

.order {
  width: 100%;
}
@media screen and (min-width: 780px) {
  .order-card{ max-height: 270px; }
}


</style>
