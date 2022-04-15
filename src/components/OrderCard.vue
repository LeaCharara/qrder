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
            <div v-if="order.status === 'Done' " class="text-center align">
                <v-btn
                rounded
                color="normal"
                dark
                >
                Details
                </v-btn>
            </div>
            <div v-else class="text-center align">
                <v-btn
                rounded
                color="normal"
                dark
                @click="TrackOrder"
                >
                Track
                </v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script>
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
      TrackOrder(){
        this.$router.push({ name: "status", params: { id: this.order.id, restaurantName : this.order.restaurantName } })

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
