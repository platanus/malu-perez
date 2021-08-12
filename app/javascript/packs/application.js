import Vue from 'vue/dist/vue.esm';
import Hms from '../components/hms.vue';
import DailyCo from '../components/daily-co.vue';
import '../css/application.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#vue-app',
    components: { Hms, DailyCo },
  });

  return app;
});
