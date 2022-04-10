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
import { SignIn } from "./server/db.js";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data: () => ({
    isLandscape: false,
  }),
  async created() {
    const user = await SignIn("leacharara@hotmail.com", "Testtest1.");
    window.localStorage.setItem("token", user.accessToken);
    window.localStorage.setItem("userId", user.uid);
    this.isLandscape = window.innerWidth > window.innerHeight;
    console.log('Firebase cloud messaging object', this.$messaging)
    const token = await getToken(this.$messaging,{ vapidKey: "BKMetiMUvVfMeO7BY1sYllLWcTBK-sVr456aMlYjt49jmNJodpBB42GUXX8IvYSkSwk1gcx0dNBJzyxjqcJau3U" })
    console.log(token)
    // await getTokenFromFirebase()
  },
  async mounted() {
    

    // try {
    //   await messaging.requestPermission();
    // } catch (err) {
    //   // eslint-disable-next-line no-console
    //   console.error("Unable to get permission to notify.", err);
    // }
    // try {
    //   const currentToken = await messaging.getToken();
    //   this.fcmToken = currentToken;
    // } catch (err) {
    //   // eslint-disable-next-line no-console
    //   console.error("Unable to retrieve token.", err);
    // }
    // const vm = this;
    // messaging.onTokenRefresh(async () => {
    //   try {
    //     const refreshedToken = await messaging.getToken();
    //     // eslint-disable-next-line no-console
    //     console.log("Token refreshed.");
    //     vm.fcmToken = refreshedToken;
    //   } catch (err) {
    //     // eslint-disable-next-line no-console
    //     console.error("Unable to retrieve refreshed token.", err);
    //   }
    // });
  },
};
</script>
