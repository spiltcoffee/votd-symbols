<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="raid-logo.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title>
          {{ $vuetify.breakpoint.xs ? "VotD" : "Vow of the Disciple" }}
          Symbol Helper
        </v-toolbar-title>
      </div>

      <v-spacer />

      <v-btn icon v-if="!editing" @click="startEditing">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn icon v-if="editing" @click="resetEditing">
        <v-icon>mdi-reload</v-icon>
      </v-btn>

      <v-btn icon v-if="editing" @click="acceptEditing">
        <v-icon>mdi-check</v-icon>
      </v-btn>

      <v-btn icon v-if="editing" @click="cancelEditing">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav>
        <v-list-item>
          <v-list-item-title> VotD Symbol Helper </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title> Symbol Size </v-list-item-title>
            <v-slider
              v-model="symbolWidth"
              max="400"
              min="50"
              thumb-label
              step="5"
              dense
              hide-details
            >
              <template v-slot:thumb-label="{ value }">
                {{ value }}px
              </template>
            </v-slider>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item>
          <v-switch v-model="darkMode" label="Use the Darkness"></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <SymbolCollection
        :collection="editing ? editingCollection : collection"
        @input="updateCollection"
        :width="width"
        :editing="editing"
      />
    </v-main>
  </v-app>
</template>

<style scoped>
.invisible {
  visibility: hidden;
}
</style>

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
    collection: VotdSymbolCollection.default(),
    editingCollection: null as unknown as VotdSymbolCollection,
    width: 150,
    editing: false,
    drawer: false,
    resetDialog: false,
  }),

  mounted() {
    try {
      const lsSymbolWidth = localStorage.getItem("symbolWidth");
      if (lsSymbolWidth) {
        this.width = JSON.parse(lsSymbolWidth);
      }
    } catch {
      // ignore
    }
  },

  computed: {
    darkMode: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set(newDarkMode: boolean) {
        this.$vuetify.theme.dark = newDarkMode;
        localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
      },
    },
    symbolWidth: {
      get() {
        return this.width;
      },
      set(newWidth: number) {
        this.width = newWidth;
        localStorage.setItem("symbolWidth", JSON.stringify(newWidth));
      },
    },
  },

  methods: {
    updateCollection(newCollection: VotdSymbolCollection) {
      this.editingCollection = newCollection;
    },
    resetEditing() {
      this.resetDialog = true;
    },
    resetEditingConfirm() {
      this.resetDialog = false;
      this.collection = VotdSymbolCollection.default();
      this.endEditing();
    },
    startEditing() {
      this.editing = true;
      this.editingCollection = this.collection.clone();
    },
    acceptEditing() {
      this.collection = this.editingCollection;
      this.endEditing();
    },
    cancelEditing() {
      this.endEditing();
    },
    endEditing() {
      this.editing = false;
      this.editingCollection = null as unknown as VotdSymbolCollection;
    },
  },
});
</script>
