<template>
<v-main style="overflow:hidden;">
  <qrcode-stream v-if="!orderNullUser" class="qrcode"  @decode="onDecode"  @init="onInit"></qrcode-stream>
</v-main>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";
export default {
  components: {
    QrcodeStream
  },
  data : () => ({
      isLandscape : false,
      orderNullUser : false,
  }),
  created () {
      this.isLandscape = window.innerWidth > window.innerHeight;
      const order = JSON.parse(window.localStorage.getItem("order"));
      if(order){
        this.$router.push({ name: "status", params: { id: order.id, restaurantName : order.restaurantName } })      
      }
  },
  methods: {
    onDecode(decodedString) {
      const index = decodedString.lastIndexOf('/');
      const id = decodedString.slice(index + 1);
      this.showMenu(id)
    },
    showMenu(id){
        this.$router.push({name: 'menu', params: {id: id, fromPageScan: true}})
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permission";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.error =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    },
  },
};
</script>

<style scoped>
.qrcode-stream-wrapper {
    position: inherit !important;
    height: 100vh !important;
     
}
</style>