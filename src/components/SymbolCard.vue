<template>
  <v-card :width="width" :class="{ redacted: redacted && !editing }">
    <v-img
      :src="symbol.url"
      contain
      class="align-end"
      transition="scale-transition"
      :width="width"
    >
      <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
        <text
          ref="svgText"
          x="100"
          y="173"
          text-anchor="middle"
          class="symbol-name"
        >
          {{ symbol.name }}
        </text>
      </svg>
    </v-img>
    <v-text-field
      class="mx-1 pb-2"
      v-if="editing"
      :label="symbol.originalName"
      :value="symbol.customName"
      @change="updateName"
      hide-details
    ></v-text-field>
  </v-card>
</template>

<style scoped>
svg {
  font-size: 32px;
}

.symbol-name {
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  fill: white;
  stroke: black;
  stroke-width: 2px;
  stroke-opacity: 0.7;
}
.redacted {
  opacity: 0.25;
}

.symbol-title {
  overflow-wrap: normal;
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

  mounted() {
    this.resizeText();
  },

  updated() {
    this.resizeText();
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
    resizeText() {
      const svgText = this.$refs.svgText as SVGTextElement;
      svgText.removeAttribute("font-size");
      const textBBox = svgText.getBBox();
      const widthScale = Math.min(180 / textBBox.width, 1);
      svgText.setAttribute("font-size", `${widthScale}em`);
    },
  },
});
</script>
