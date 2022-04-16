<template>
  <!-- <v-container> -->
    <v-row>
      <v-col cols="4" sm="3">
        <v-img class="img-height" :src="item.img"></v-img>
      </v-col>
      <v-col cols="8" sm="9">
        <v-row>
          <v-col cols="8">
            <h4
              :class="[
                this.$vuetify.display.smAndUp ? 'otherFontSize' : 'smallFontSize',
              ]"
            >
              {{ item.name }}
            </h4>
          </v-col>
          <v-col cols="4" align="right">
            <h4
              :class="[
                this.$vuetify.display.smAndUp ? 'otherFontSize' : 'smallFontSize',
              ]"
            >
              {{ item.price }} $
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-list-item-subtitle class="description">{{
            item.description
          }}</v-list-item-subtitle>
        </v-row>
        <v-col class="d-flex justify-center align-center" style="margin-top:5%" v-if="fromPageScan">
          <v-icon class="buttonIcons" style="margin-right : 10px" @click="substract">mdi-minus</v-icon>
          <span :class="[
                this.$vuetify.display.smAndUp ? 'otherFontSize' : 'smallFontSize',
              ]" >{{this.currentItem.quantity}}</span>
          <v-icon class="buttonIcons" style="margin-left : 10px" @click="add">mdi-plus</v-icon>
        </v-col>
      </v-col>
    </v-row>
  <!-- </v-container> -->
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    fromPageScan : {
      type : String,
      default: 'false',
    }
  },
  data: () => ({
    currentItem : {},
    fromScan : false
  }),
  methods: {
    add(){
      this.currentItem.quantity = this.currentItem.quantity + 1;
      this.$emit('updateQuantity',{id : this.currentItem.id, quantity : this.currentItem.quantity, name: this.currentItem.name, price: this.currentItem.price, type : this.currentItem.type})
    },
    substract(){
      this.currentItem.quantity > 0 ? this.currentItem.quantity = this.currentItem.quantity - 1 : this.currentItem.quantity = 0;
      this.$emit('updateQuantity',{id : this.currentItem.id, quantity : this.currentItem.quantity, name: this.currentItem.name, price: this.currentItem.price, type : this.currentItem.type})
    }
  },
  created () {
    this.currentItem = {...this.item}
    if(!this.item.quantity) this.currentItem.quantity = 0;
    this.fromScan = this.fromPageScan === 'true'
  },
};
</script>

<style scoped>
h4 {
  margin-left: -12px;
}
.description {
  margin-bottom: 20px;
}

.smallFontSize {
  font-size: 14px;
}

.otherFontSize {
  font-size: 24px;
}

.buttonIcons {
  border: 1px solid;
  border-radius: 50px;
}
.img-height{
  max-height: 200px;
}
</style>
