<template>
  <v-card :width="symbolWidth">
    <v-img
      :src="url"
      contain
      transition="scale-transition"
      :width="symbolWidth"
    ></v-img>
    <v-card-title class="symbol-title">{{ name }}</v-card-title>
  </v-card>
</template>

<style scoped>
.symbol-title {
  justify-content: center;
  text-align: center;
  word-break: normal;
}
</style>

<script lang="ts">
import { VotdSymbol } from "@/symbols";
import Vue from "vue";

export default Vue.extend({
  name: "SymbolCard",

  props: {
    votdSymbol: {
      type: Object,
      required: true,
    },
  },

  inject: ["symbolWidth"],

  computed: {
    url: {
      get(this: { votdSymbol: VotdSymbol }) {
        return this.votdSymbol.url;
      },
    },
    name: {
      get(this: { votdSymbol: VotdSymbol }) {
        return this.votdSymbol.name;
      },
    },
  },
});
</script>
