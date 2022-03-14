<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="raid-logo.png"
          transition="scale-transition"
          width="40"
        />
        Vow of the Disciple Symbol Helper
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <SymbolCollection :collection="collection"></SymbolCollection>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { VotdSymbolCollection } from "./symbols";
import SymbolCollection from "./components/SymbolCollection.vue";

export default Vue.extend({
  name: "App",

  components: {
    SymbolCollection,
  },

  data: () => ({
    collection: VotdSymbolCollection.build(),
    symbolWidth: 180,
  }),

  provide() {
    return { symbolWidth: this.symbolWidth };
  },
});
</script>
