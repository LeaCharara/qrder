<template>
  <div>
    <div class="top-bar">
    <h3>ORDER STATUS : {{ restaurantName }}</h3>
    <v-spacer />
    <v-icon @click="close">mdi-close</v-icon>
  </div>
    <div>
      <v-progress-linear
        style="margin-top: 20px; height: 20px; margin-bottom: 10%"
        :model-value="value"
        color="green"
      ></v-progress-linear>
    </div>
    <h3 class="status" :style="status === 'Received' ? 'color:green' : ''">
     <v-icon v-if="doneStatuses.includes('Received')" style="color: green; margin-right : 10px;">mdi-checkbox-marked-circle</v-icon> Your order was received
    </h3>
    <h3 class="status" :style="status === 'Preparing' ? 'color:green' : ''">
      <v-icon v-if="doneStatuses.includes('Preparing')" style="color: green; margin-right : 10px;">mdi-checkbox-marked-circle</v-icon>Preparations are under way
    </h3>
    <h3
      class="status"
      :style="status === 'Ready to be served' ? 'color:green' : ''"
    >
      <v-icon v-if="doneStatuses.includes('Ready to be served')" style="color: green; margin-right : 10px;">mdi-checkbox-marked-circle</v-icon>Ready to be served
    </h3>
    <h3 class="status" :style="status === 'Serving' ? 'color:green' : ''">
      <v-icon v-if="doneStatuses.includes('Serving')" style="color: green; margin-right : 10px;">mdi-checkbox-marked-circle</v-icon>Anthony is serving you your
      order
    </h3>
    <h3 class="status" :style="status === 'Done' ? 'color:green' : ''">
      <v-icon v-if="doneStatuses.includes('Done')" style="color: green; margin-right : 10px;">mdi-checkbox-marked-circle</v-icon>Your order has been served
    </h3>
  </div>
</template>

<script>
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../server/db.js";
export default {
  props: ["id", "restaurantName"],
  data() {
    return {
      value: 25,
      status: "Received",
      statuses: ["Received", "Preparing", "Ready to be served", "Serving", "Done"],
      doneStatuses : []
    };
  },
  created() {
    const status = onSnapshot(
      doc(db, "orders", this.id),
      { includeMetadataChanges: true },
      (doc) => {
        this.status = doc.data().status;
        const index = this.statuses.indexOf(this.status)
        this.doneStatuses = this.statuses.slice(0, index+1);
        if(this.status === 'Done') window.localStorage.removeItem("order")
        this.value = 20 * (this.statuses.indexOf(this.status) + 1);
      }
    );
  },
  methods: {
    close(){
      this.$router.push({name:'orders'})
    }
  }
};
</script>
<style>
.top-bar {
  color: white;
  text-align: center;
  background-color: black;
  display: flex;
}
.status {
  margin-left: 20px;
  margin-bottom : 10px;
}

</style>
