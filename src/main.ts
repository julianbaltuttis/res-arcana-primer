import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import VueLogger from 'vuejs-logger'
import i18n from './i18n'
// Imports global css
import "@/assets/global.css"

// Vue i18n router guard configuration
router.beforeEach((to, from, next) => {

  // use the language from the routing param or default language
  let language = to.params.lang;
  if (!language) {
    language = 'en'
  }

  // set the current language for i18n.
  i18n.locale = language;
  next();
})

// VueLogger configuration and loading
// const isProduction = process.env.NODE_ENV === 'production';
const isProduction = true

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
};
// @ts-ignore
Vue.use(VueLogger, options);

// Loads Vue app
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
