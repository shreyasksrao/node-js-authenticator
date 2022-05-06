/*jshint esversion: 8 */
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from './plugins/font-awesome';

let app = createApp(App);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount('#app');
