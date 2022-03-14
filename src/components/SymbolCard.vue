<template>
  <v-card :width="width">
    <v-img
      :src="symbol.url"
      contain
      transition="scale-transition"
      :width="width"
    />
    <v-text-field
      v-if="editing"
      :label="symbol.originalName"
      :value="symbol.name"
      @input="updateName"
    ></v-text-field>
    <v-card-title class="symbol-title" v-else>{{ symbol.name }}</v-card-title>
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

  methods: {
    updateName(newName: string) {
      const symbol = this.symbol.clone();
      symbol.name = newName;
      this.$emit("input", symbol);
    },
  },
});
</script>
