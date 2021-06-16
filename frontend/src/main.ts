import Vue, { VNode, CreateElement } from 'vue';
import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';
import locale from 'view-design/dist/locale/en-US';
import App from '@/App.vue';
import '@/registerServiceWorker';
import router from '@/router';
import store from '@/store';
import '@/assets/table.css';
import { setupVmmAuth, checkTokenValid } from '@/helpers/backend-helper';


Vue.use(ViewUI, { locale });

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: (h: CreateElement): VNode => h(App),
});

function showErrorPage() {
  const container = document.getElementById('noAuth');
  container?.setAttribute('style', 'display: block');
}

setupVmmAuth();

checkTokenValid()
  .then(() => {
    app.$mount('#app');
  })
  .catch(() => {
    showErrorPage();
  });
