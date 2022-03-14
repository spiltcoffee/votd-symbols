<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon v-if="!editing" class="invisible">
        <v-icon>mdi-dummy</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

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

      <v-spacer></v-spacer>

      <v-btn icon v-if="!editing" class="invisible">
        <v-icon>mdi-dummy</v-icon>
      </v-btn>

      <v-btn icon v-if="!editing" @click="startEditing">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn icon v-if="editing" @click="acceptEditing">
        <v-icon>mdi-check</v-icon>
      </v-btn>

      <v-btn icon v-if="editing" @click="cancelEditing">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list dense nav>
        <v-list-item>
          <v-switch
            v-model="$vuetify.theme.dark"
            inset
            label="Use the Darkness"
            persistent-hint
          ></v-switch>
        </v-list-item>
        <v-list-item>
          <v-slider
            v-model="width"
            label="Symbol Size"
            max="400"
            min="50"
            thumb-label="always"
            step="5"
          >
            <template v-slot:thumb-label="{ value }"> {{ value }}px </template>
          </v-slider>
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
  }),

  methods: {
    updateCollection(newCollection: VotdSymbolCollection) {
      this.editingCollection = newCollection;
    },
    startEditing() {
      this.editing = true;
      this.editingCollection = this.collection.clone();
    },
    acceptEditing() {
      this.editing = false;
      this.collection = this.editingCollection;
      this.editingCollection = null as unknown as VotdSymbolCollection;
    },
    cancelEditing() {
      this.editing = false;
      this.editingCollection = null as unknown as VotdSymbolCollection;
    },
  },
});
</script>
