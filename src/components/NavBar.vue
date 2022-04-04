  <template>
  <v-bottom-navigation 
  v-model="value" 
    color="white"
    style="background-color:black"
    >
    <v-btn style="color:grey" @click="value='Catalog'" to="/"  value="Catalog">
      <v-icon>mdi-food</v-icon>
      <span>Catalog</span>

    </v-btn>

    <v-btn style="color:grey" to="/scan" @click="value='Scan'"    value="Scan">
      <v-icon>mdi-qrcode</v-icon>
      <span>Scan</span>

    </v-btn>

    <v-btn style="color:grey" to="/orders" @click="value='Orders'" value="Orders">
      <v-icon>mdi-history</v-icon>
            <span>Orders</span>

    </v-btn>

    <v-btn style="color:grey" @click="value='Profile'"  value="Profile">
      <v-icon>mdi-account</v-icon>
            <span>Profile</span>

    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  export default {
    data: () => ({ value: 'Catalog', color : "black" }),
  }
</script>

<style scoped>
.btnColor {
  color: "white";
}
</style>



