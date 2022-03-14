<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-col v-for="votdSymbol in collection" :key="votdSymbol.id" cols="auto">
        <SymbolCard :votd-symbol="votdSymbol"></SymbolCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SymbolCard from "./SymbolCard.vue";
import Vue from "vue";

export default Vue.extend({
  name: "SymbolCollection",

  components: {
    SymbolCard,
  },

  props: {
    collection: {
      type: Array,
      required: true,
    },
  },
});
</script>
