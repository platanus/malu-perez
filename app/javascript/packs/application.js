import Vue from 'vue/dist/vue.esm';
import HundredMs from '../components/hundred-ms.vue';
import '../css/application.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#vue-app',
    components: { HundredMs },
  });

  return app;
});
