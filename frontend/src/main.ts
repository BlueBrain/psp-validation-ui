import Vue, { VNode, CreateElement } from 'vue';
import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';
import locale from 'view-design/dist/locale/en-US';
import App from '@/App.vue';
import '@/registerServiceWorker';
import router from '@/router';
import store from '@/store';
import { init as authInit } from '@/helpers/auth';
import '@/assets/table.css';
import { TokenAndUser } from '@/interfaces/auth';
import { globalMessages } from '@/constants/backend';


Vue.use(ViewUI, { locale });

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: (h: CreateElement): VNode => h(App),
});


authInit()
  .then(async ({ token, userId }: TokenAndUser) => {
    store.commit('setToken', token);
    await store.dispatch('saveUserId', userId);
    app.$mount('#app');
  })
  .catch((e: Error) => {
    // error emitted from oidc-client library
    if (e.message.includes(globalMessages.LOGIN_REQUIRED)) return;
    console.warn('General error:', e);
  });
