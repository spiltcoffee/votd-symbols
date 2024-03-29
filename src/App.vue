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
          <v-list-item-content>
            <v-list-item-title>Symbol Helper</v-list-item-title>
            <v-list-item-subtitle>Vow of the Disciple</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item>
          <v-select
            label="View"
            v-model="viewObject"
            :items="views"
            item-text="name"
            return-object
          />
        </v-list-item>

        <v-divider />

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Size of Symbols</v-list-item-title>
            <v-slider
              v-model="width"
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
          <v-switch v-model="darkMode" label="Use the Darkness?"></v-switch>
        </v-list-item>

        <v-divider />

        <v-list-item
          href="https://github.com/spiltcoffee/votd-symbols"
          target="_blank"
          rel="noreferrer noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>spiltcoffee/votd-symbols</v-list-item-title>
            <v-list-item-subtitle>GitHub</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          href="https://spiltcoffee.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-web</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>spiltcoffee.com</v-list-item-title>
            <v-list-item-subtitle>Website</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          href="https://www.bungie.net/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            All images are property of Bungie
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <SymbolCollection
        :view="view"
        :collection="editing ? editingCollection : collection"
        @input="updateCollection"
        :width="width"
        :editing="editing"
      />
    </v-main>

    <v-snackbar v-model="snackbar" timeout="2000">
      {{ snackbarText }}
    </v-snackbar>

    <v-dialog v-model="resetDialog" persistent width="320">
      <v-card>
        <v-card-title> Are you sure? </v-card-title>
        <v-card-text>
          This will discard all changes to symbol names.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="resetEditingAccept">
            Yes, Reset
          </v-btn>
          <v-btn color="blue" @click="resetEditingCancel"> No, Keep </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
.invisible {
  visibility: hidden;
}
</style>

<script lang="ts">
import Vue from "vue";
import { VotdSymbolCollection, VotdSymbolView } from "./symbols";
import SymbolCollection from "./components/SymbolCollection.vue";

const VIEWS = [
  { name: "Default", view: VotdSymbolView.default },
  { name: "Acquisition", view: VotdSymbolView.aquisition },
  { name: "Extra Boss Chest", view: VotdSymbolView.extraChest },
  { name: "Lore Puzzle Room", view: VotdSymbolView.lorePuzzle },
];

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
    snackbar: false,
    snackbarText: "",
    viewObject: VIEWS[0],
  }),

  mounted() {
    try {
      const lsWidth = localStorage.getItem("width");
      if (lsWidth) {
        this.width = JSON.parse(lsWidth);
      }
    } catch {
      // ignore
    }

    try {
      const lsView = localStorage.getItem("view");
      if (lsView) {
        const viewName = JSON.parse(lsView);
        this.viewObject =
          VIEWS.find((view) => view.name === viewName) || VIEWS[0];
      }
    } catch {
      // ignore
    }

    if (location.search) {
      try {
        const serializedCollection = location.search.replace(/^\?/, "");
        this.collection =
          VotdSymbolCollection.deserialize(serializedCollection);
      } catch (error) {
        history.replaceState("", "", location.pathname);
      }
    } else {
      try {
        const lsSerializedCollection = localStorage.getItem("collection");

        if (lsSerializedCollection) {
          const serializedCollection = JSON.parse(lsSerializedCollection);
          if (serializedCollection) {
            this.collection =
              VotdSymbolCollection.deserialize(serializedCollection);
            this.endEditing();
          }
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("popstate", (event) => {
      try {
        this.collection = VotdSymbolCollection.deserialize(event.state);
      } catch (error) {
        history.replaceState("", "", location.pathname);
      }
    });
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
    views: {
      get() {
        return VIEWS;
      },
    },
    view: {
      get() {
        return this.viewObject.view();
      },
    },
  },

  watch: {
    width: {
      handler(newWidth) {
        localStorage.setItem("width", JSON.stringify(newWidth));
      },
    },
    viewObject: {
      handler(newViewObject) {
        this.view = newViewObject.view();
        localStorage.setItem("view", JSON.stringify(newViewObject.name));
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
    resetEditingAccept() {
      this.resetDialog = false;
      this.collection = VotdSymbolCollection.default();
      this.endEditing();
      this.snackbarText = "All Symbol Names Discarded";
      this.snackbar = true;
    },
    resetEditingCancel() {
      this.resetDialog = false;
    },
    startEditing() {
      this.snackbar = false;
      this.editing = true;
      this.editingCollection = this.collection.clone();
    },
    acceptEditing() {
      this.collection = this.editingCollection;
      this.endEditing();
      this.snackbarText = "Changes Saved";
      this.snackbar = true;
    },
    cancelEditing() {
      this.endEditing();
      this.snackbarText = "Changes Discarded";
      this.snackbar = true;
    },
    endEditing() {
      this.editing = false;
      this.editingCollection = null as unknown as VotdSymbolCollection;
      const serializedCollection = VotdSymbolCollection.serialize(
        this.collection
      );
      history.pushState(
        serializedCollection,
        "",
        serializedCollection
          ? `${location.pathname}?${serializedCollection}`
          : location.pathname
      );
      localStorage.setItem("collection", JSON.stringify(serializedCollection));
    },
  },
});
</script>
