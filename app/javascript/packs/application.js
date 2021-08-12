import Vue from 'vue/dist/vue.esm';
import DailyCo from '../components/daily-co.vue';
import '../css/application.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#vue-app',
    components: { DailyCo },
  });

  return app;
});
