<template>
  <div v-if="isLandscape && this.$vuetify.display.mdAndUp && fromPageScan">
    <v-navigation-drawer permanent left app style="width: 40% !important">
     <div class="top-bar">
    <v-icon v-if="!fromPageScan" @click="Back" style="margin-right: 20px"
      >mdi-arrow-left-thick</v-icon
    ><h3>{{ menu.title }}</h3>
  </div>
  <v-list>
    <v-list-item v-for="(m, index) in menu.menu_types" :key="index">
      <div class="menu">
        <v-list-item-title class="item-types">{{ m.title }}</v-list-item-title>
        <v-divider />
        <v-card
          class="item-card"
          :elevation="1"
          outlined
          v-for="item in m.menu_items"
          :key="item.name"
          style="padding: 20px; margin-top: 20px"
        >
          <MenuItemCard :fromPageScan="fromPageScan.toString()" :item="item" @updateQuantity="updateQuantity($event)"/>
        </v-card>
      </div>
    </v-list-item>
  </v-list>
    </v-navigation-drawer>
    <v-main class="large-screen"> 
      <OrderRecap 
      :order="JSON.stringify(this.orderedItem)" 
      :resto="JSON.stringify(this.restaurantInfo)"
      :isLandscape="JSON.stringify(this.isLandscape)"
      />
    </v-main>
  </div>
  <div v-else>
  <div class="top-bar" >
    <v-icon v-if="!fromPageScan" @click="Back" style="margin-right: 20px"
      >mdi-arrow-left-thick</v-icon
    ><h3>{{ menu.title }}</h3>
  </div>
  <v-list>
    <v-list-item v-for="(m, index) in menu.menu_types" :key="index">
      <div class="menu">
        <v-list-item-title class="item-types">{{ m.title }}</v-list-item-title>
        <v-divider />
        <v-card
          class="item-card"
          :elevation="1"
          outlined
          v-for="item in m.menu_items"
          :key="item.name"
          style="padding: 20px; margin-top: 20px"
        >
          <MenuItemCard :fromPageScan="fromScan.toString()" :item="item" @updateQuantity="updateQuantity($event)"/>
        </v-card>
      </div>
    </v-list-item>
  </v-list>
  <v-btn :disabled="orderedItem.length === 0" v-if="fromPageScan" @click="viewCart" class="orderbtn">Review order</v-btn>
  </div>
</template>

<script>
import { getRestaurant, getRestaurantMenu } from "../server/db.js";
import MenuItemCard from "../components/MenuItemCard.vue";
import OrderRecap from "../views/OrderRecap.vue"
export default {
  name: "Menu",
  props: 
  {
    id : {
      type : String,
      default : ""
    },
    fromPageScan : {
      type : String,
      default : ''
    },
    orderRecapItems : {
      type : String,
      default : ""
    }
  },
  components: {
    MenuItemCard,
    OrderRecap
  },
  data: () => ({
    menu: {
      title: "",
      menu_types: {},
    },
    restaurantInfo : {},
    orderedItem : [],
    isLandscape : false,
    fromScan : false,
  }),
  methods: {
    async getMenu() {
      const restaurant = await getRestaurant(this.id);
      console.log(restaurant)
      if(!restaurant.title) {
        alert("Invalid QR CODE")
        this.$router.push({name : 'scan'})
      }
      this.restaurantInfo = {...restaurant}
      this.menu.title = restaurant.title;
      const menu = await getRestaurantMenu(this.id);
      this.menu.menu_types = menu;
      if(this.orderRecapItems){
        this.orderedItem = JSON.parse(this.orderRecapItems)
      
      this.orderedItem.map(item => {
        const index = this.menu.menu_types[item.type].menu_items.findIndex(i => i.name === item.name);
        this.menu.menu_types[item.type].menu_items[index].quantity = item.quantity
      })}
    },
    Back() {
      if (this.isLandscape && this.$vuetify.display.mdAndUp) {
        this.$router.push({ name: "catalog", params: {BackchosenRestaurantId:this.id }});
      } else
        this.$router.push({ name: "description", params: { id: this.id } });
    },
    updateQuantity(item){
      const index = this.orderedItem.findIndex(element => element.id === item.id);
      if(index != -1) {
        if (item.quantity === 0) this.orderedItem.splice(index, 1)
        else this.orderedItem[index] = {...item}
      }
      else if(item.quantity !== 0) this.orderedItem.push({...item})
    },
    onScreenResize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
    viewCart(){
      this.$router.push({name: 'recap', params: {order:JSON.stringify(this.orderedItem), resto: JSON.stringify(this.restaurantInfo)}})
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
  async created() {
    await this.getMenu();
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.fromScan = this.fromPageScan === 'true'
  },
};
</script>

<style lang="scss" scoped>

.item-types {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}
.menu {
  width: 100%;
}
.top-bar {
  color: white;
  background-color: black;
  padding: 20px;
  display: flex;
}
@media screen and (min-width: 780px) {
  .item-card{ max-height: 270px; }
  .item-types{ font-size: 30px;}
}

@media screen and (min-width: 380px) {
  .orderbtn {
  position : fixed;
  bottom : 6%!important;
  }
}
.orderbtn {
  padding: 20px;
  width: 100%;
  position : fixed;
  bottom : 8%;
  background-color : black;
  color : white;
}

.v-main.large-screen {
  padding-left: 40% !important;
}
</style>
