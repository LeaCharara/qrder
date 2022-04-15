<template>
    <v-row>
        <v-col sm="4">
        <v-img class="img-height" width="100%" height="100%" :src="order.img"></v-img>
        </v-col>
        <v-col sm="5">
          <v-list-item-title>
              {{ order.restaurantName }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-model="maxLength"
          >
              {{ order.description.substr(0, maxLength) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle align-self="end">
              {{ format_date(order.date) }} - {{ order.total }} $ CA
          </v-list-item-subtitle>
        </v-col>
        <v-col sm="3" align-self="center">
            <div class="text-center align">
                <v-btn
                rounded
                color="normal"
                dark
                @click="Details"
                >
                Details
                </v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import {getOrderDetail} from '../server/db.js'
export default {
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    format_date(timestamp){
      const msTimestamp = timestamp * 1000
      let date = new Date(msTimestamp)
      date = date.toLocaleString('default', { month: 'short', day : 'numeric' });
      return date
      },
      async Details(){
        const itemDetails = await getOrderDetail(this.order.id);
        // console.log(JSON.stringify(itemDetails))
        this.$router.push({name : 'recap', params: {order : JSON.stringify(itemDetails), fromOrders : true}})
      }
  },
  data() {
    return{
      maxLength : 50
    }
  },
};
</script>

<style scoped>
h4 {
  margin-left: -12px;
}
.img-height{
  max-height: 200px;
}
</style>
