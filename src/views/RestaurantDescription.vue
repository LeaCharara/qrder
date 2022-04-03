<template>
  <v-main class="desc" :class="isLandscape ? 'landscape' : 'mobile'">
      <h3 v-if="!isLandscape" class="top-bar"><v-icon  style="margin-right:20px" @click="Back" >mdi-arrow-left-thick</v-icon>Restaurant Information</h3>
    <v-col align="center" class="info-wrapper">
    <v-col class="info">
      <h2>{{ currentRestaurant.title }}</h2>
      <span>{{ currentRestaurant.address }}</span>
      <v-row style="margin-left: 2px; margin-top: 10px">
        <p>{{ currentRestaurant.type }}</p>
        <v-spacer />
        <p>{{ currentRestaurant.priceLevel }}</p>
      </v-row>
    </v-col>
    <v-col align="center" class="map">
      <Map :lat="currentRestaurant.lat" :lng="currentRestaurant.lng" />
    </v-col>
    <v-btn @click="showMenu" class="descbutton">GO TO MENU</v-btn>
    </v-col>
  </v-main>
</template>
<script>
import Map from "../components/Map.vue";
import { getRestaurant } from "../server/db.js";
import {priceLevel} from "../imports/helpers.js"
export default {
  components: {
    Map,
  },
  props: {
    restaurant: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: "",
    },
    isLandscape : {
      type : Boolean,
      default: false,
    }
  },
  data() {
    return {
      currentRestaurant: {},
      
    };
  },
  mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onScreenResize);
        })
    },
    unmounted() { 
      window.removeEventListener('resize', this.onScreenResize); 
  },
  methods: {
    async getCurrentRestaurant(id) {
      const temp = await getRestaurant(id);
      return temp;
    },
    Back(){
        this.$router.push({path: "/"})
    },
    showMenu(){
      this.$router.push({name: 'menu', params: {id: this.id, isLandscape: this.isLandscape}})
    },
    onScreenResize() {
            if(window.innerWidth > window.innerHeight && this.$vuetify.display.mdAndUp){
              this.$router.push({name:"catalog", params: {BackchosenRestaurantId:this.id, fromPageScan: false}})
            }
        }
  },
  async created() {
    if(this.id.length > 0){
      this.currentRestaurant = await this.getCurrentRestaurant(this.id);
      this.currentRestaurant.priceLevel = priceLevel(this.currentRestaurant.priceLevel);
    }
  },
  watch : {
    async id(value) {
      this.currentRestaurant = await this.getCurrentRestaurant(value);
      this.currentRestaurant.priceLevel = priceLevel(this.currentRestaurant.priceLevel);
    }
  }
};
</script>

<style lang="scss">

.v-main.desc {
  padding: 0 !important;
}

.top-bar {
  color: white;
  background-color: black;
  padding: 20px;
  display: flex;
  height: 68px;
}

.info-wrapper.v-col {
  .mobile & {
    height: calc(100vh - 68px - 56px)
  }

  .landscape &, .landscapeLargeScreen &, .landscapeXLScreen & {
    height: calc(100vh - 56px);
  }

  position: relative;
  padding: 32px 10%;
}

.info {
  border: 1px black solid !important;
  padding: 20px !important;
  text-align: left;
}

.v-col.map {
  padding: 0;
  height: 55%;
  margin-top: 20px;
}

.descbutton {
  background-color: black;
  color: white !important;
  width: 80%;
  position: absolute;
  margin-top: 20px;
  left: 10%;
}

.v-main__wrap {
  position: inherit !important;
}
</style>
