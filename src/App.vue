<template>
  <h1>Gym app</h1>
  <div v-if="isLoggedIn">
    <button @click="signOut">Logout</button>
  </div>
   <router-view></router-view>
  
</template>

<script>
import firebase from 'firebase'
import router from './router';

export default {
  data() {
    return {
     isLoggedIn: true,
     name: '', 
     email: '',
    }
  },
  name: 'App',
  created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.isLoggedIn = true // if we have a user
          this.name = user.displayName
          this.email = user.email
        } else {
          this.isLoggedIn = false // if we do not
          router.push('/login');
          this.name = ""
          this.email = ""
        }
      });
  },
  methods: {
    signOut() {
      firebase.auth().signOut(); 
      router.push('/login');
    },
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
