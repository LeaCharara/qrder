<template>
  <v-app>
    <v-main
      :class="
        this.isLandscape && this.$vuetify.display.mdAndUp ? 'large-screen' : ''
      "
      style="padding-left: 0px"
    >
      <router-view />
    </v-main>
    <NavBar />
  </v-app>
</template>

<script>
import NavBar from "../src/components/NavBar.vue";
import { getToken } from "firebase/messaging";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data: () => ({
    isLandscape: false,
  }),
  async created() {
    this.isLandscape = window.innerWidth > window.innerHeight;
    const token = await getToken(this.$messaging,{ vapidKey: "BKMetiMUvVfMeO7BY1sYllLWcTBK-sVr456aMlYjt49jmNJodpBB42GUXX8IvYSkSwk1gcx0dNBJzyxjqcJau3U" })
    window.localStorage.setItem("Message_Token", token);
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  }
};
</script>
