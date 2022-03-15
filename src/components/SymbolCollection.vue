<template>
  <v-container fluid>
    <div class="mb-4" v-if="view.title || view.subtitle">
      <div class="text-h5" v-if="view.title">{{ view.title }}</div>

      <div class="text-subtitle-1" v-if="view.subtitle">
        {{ view.subtitle }}
      </div>
    </div>

    <div v-for="(category, index) in view.categories" :key="`category${index}`">
      <div class="mb-4" v-if="category.title || category.subtitle">
        <div class="text-h6" v-if="category.title">{{ category.title }}</div>

        <div class="text-subtitle-1" v-if="category.subtitle">
          {{ category.subtitle }}
        </div>
      </div>

      <v-row justify="space-around">
        <v-col
          v-for="symbolId in category.symbols"
          :key="`symbol${symbolId}`"
          cols="auto"
        >
          <SymbolCard
            :symbol="collection.find(symbolId)"
            @input="updateSymbol"
            :width="width"
            :editing="editing"
          />
        </v-col>
      </v-row>
    </div>
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
    view: {
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
