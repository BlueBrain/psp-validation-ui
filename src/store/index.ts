import Vue from 'vue';
import Vuex from 'vuex';
import tableEditingModule from '@/store/table-editing-module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    tableEditingModule,
  },
});
