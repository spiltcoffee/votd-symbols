<template>
  <v-card :width="width" :class="{ redacted: redacted && !editing }">
    <v-img
      :src="symbol.url"
      contain
      transition="scale-transition"
      :width="width"
    />
    <v-text-field
      class="mx-1 pb-2"
      v-if="editing"
      :label="symbol.originalName"
      :value="symbol.customName"
      @change="updateName"
      hide-details
    ></v-text-field>
    <v-card-title class="symbol-title" v-else>{{ symbol.name }}</v-card-title>
  </v-card>
</template>

<style scoped>
.redacted {
  opacity: 0.25;
}

.symbol-title {
  justify-content: center;
  text-align: center;
  word-break: normal;
}
</style>

<script lang="ts">
import { VotdSymbolId } from "@/symbols";
import Vue from "vue";

export default Vue.extend({
  name: "SymbolCard",

  props: {
    symbol: {
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

  computed: {
    redacted: {
      get() {
        return this.symbol.id === VotdSymbolId.REDACTED;
      },
    },
  },

  methods: {
    updateName(newName: string) {
      const symbol = this.symbol.clone();
      symbol.name = newName;
      this.$emit("input", symbol);
    },
  },
});
</script>
