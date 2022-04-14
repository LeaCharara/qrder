<template>
  <v-card :elevation="5" outlined class="resto-card">
    <v-img width="100%" :src="r.img" transition="false"></v-img>
    <v-col style="padding-left: 20px; padding-right: 20px">
      <v-row>
        <v-col>
          <h2>
            {{ r.title }}
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-list-item-subtitle class="description"
          >{{ r.type }} - {{ trimAddress(r.address) }}</v-list-item-subtitle
        >
        <v-spacer />
        <span>{{ r.priceLevel }}</span>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
export default {
  props: {
    r: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    trimAddress(ad) {
      const split = ad.split(",");
      let road = split[0].split(" ");
      let trim = "";
      road.map((r) => {
        if (isNaN(r)) {
          trim += r + " ";
        }
      });
      return trim;
    },
  },
};
</script>

<style scoped>
h2{
  margin-left: -12px;
}
.resto-card {
  width: 100%;
}
.description {
  margin-bottom: 20px;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 1;
}
</style>
