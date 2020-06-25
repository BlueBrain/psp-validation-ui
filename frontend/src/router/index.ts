import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import GeneralPanel from '@/views/GeneralPanel.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'GeneralPanel',
    component: GeneralPanel,
  },
  {
    path: '/table',
    name: 'ConfigureTable',
    component: () => import(/* webpackChunkName: "table" */ '@/views/ConfigureTable.vue'),
  },
  {
    path: '/list',
    name: 'ValidationList',
    component: () => import(/* webpackChunkName: "list" */ '@/views/ValidationList.vue'),
  },
  {
    path: '/details',
    name: 'DetailsPage',
    component: () => import(/* webpackChunkName: "details" */ '@/views/DetailsPage.vue'),
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
