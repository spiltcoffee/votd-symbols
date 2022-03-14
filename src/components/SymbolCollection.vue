<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-col v-for="symbol in collection.symbols" :key="symbol.id" cols="auto">
        <SymbolCard
          :symbol="symbol"
          @input="updateSymbol"
          :width="width"
          :editing="editing"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SymbolCard from "./SymbolCard.vue";
import Vue from "vue";
import { VotdSymbol, VotdSymbolCollection } from "@/symbols";

export default Vue.extend({
  name: "SymbolCollection",

  components: {
    SymbolCard,
  },

  props: {
    collection: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
    },
    editing: {
      type: Boolean,
    },
  },

  methods: {
    updateSymbol(newSymbol: VotdSymbol) {
      const collection = (this.collection as VotdSymbolCollection).map(
        (symbol) => (symbol.id === newSymbol.id ? newSymbol : symbol)
      );
      this.$emit("input", collection);
    },
  },
});
</script>
