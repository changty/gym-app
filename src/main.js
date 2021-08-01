import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import firebase from 'firebase/app';
import config from './config.js';

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId, 
    measurementId: config.measurementId
  };

firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.mount('#app');

