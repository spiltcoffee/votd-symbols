import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

let darkMode = false;
try {
  const lsDarkMode = localStorage.getItem("darkMode");
  if (lsDarkMode) {
    darkMode = JSON.parse(lsDarkMode);
  }
} catch {
  // ignore
}

export default new Vuetify({
  theme: {
    dark: darkMode,
  },
});
