<template>

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
          <MenuItemCard :fromPageScan="fromPageScan" :item="item" @updateQuantity="updateQuantity($event)"/>
        </v-card>
      </div>
    </v-list-item>
  </v-list>
  <v-btn v-if="fromPageScan" @click="viewCart" class="orderbtn">Order</v-btn>
</template>

<script>
import { getRestaurant, getRestaurantMenu } from "../server/db.js";
import MenuItemCard from "../components/MenuItemCard.vue";
export default {
  name: "Menu",
  props: {
    id : {
      type : String,
      default : ""
    },
    isLandscape : {
      type : String,
      default : 'false'
    },
    fromPageScan : {
      type : Boolean,
      default : 'false'
    },
    orderRecapItems : {
      type : String,
      default : ""
    }
  },
  components: {
    MenuItemCard,
  },
  data: () => ({
    menu: {
      title: "",
      menu_types: {},
    },
    restaurantInfo : {},
    orderedItem : []
  }),
  methods: {
    async getMenu() {
      const restaurant = await getRestaurant(this.id);
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
      else this.orderedItem.push({...item})
    },
    viewCart(){
      this.$router.push({name: 'recap', params: {order:JSON.stringify(this.orderedItem), resto: JSON.stringify(this.restaurantInfo)}})
    }
  },
  async created() {
    await this.getMenu();
    
    
  },
};
</script>

<style scoped>

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
.orderbtn {
  width: 100%;
  position : fixed;
  bottom : 8%;
  background-color : black;
  color : white;
}

</style>
