import Vue from 'vue';
import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';
import locale from 'view-design/dist/locale/en-US';
// import * as locale from 'view-design/dist/locale/en-US';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';


Vue.use(ViewUI, { locale });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
