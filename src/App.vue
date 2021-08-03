<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
  <div v-if="$route.name !== 'home'">
    <button class="navbar-brand btn btn-outline-dark navbar-brand" @click="back">Back</button>
  </div>



  <p style="text-align: center;">Gym app</p>
  <div v-if="sharedState.isLoggedIn">
    <button @click="signOut" class="btn btn-danger">Logout</button>
  </div>
</nav>

<div class="container">
   <router-view></router-view>
</div>
  
</template>

<script>
import { reactive } from 'vue'
import { auth } from './firebase'
import router from './router';


const store =  {
  state: reactive({
    isLoggedIn: true,
    displayName: '',
    email: '',
  })
}

export default {
  data() {
    return {
      currentRoute: '',
      sharedState: store.state
    }
  },

  name: 'App',
  mounted() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.sharedState.isLoggedIn = true // if we have a user
          this.sharedState.name = user.displayName
          this.sharedState.email = user.email
        } else {
          this.sharedState.isLoggedIn = false // if we do not
          this.router.push('/login');
          this.sharedState.name = ""
          this.sharedState.email = ""
        }
      });
  },
  methods: {
    signOut() {
      auth.signOut(); 
      router.push('/login');
    },
    back() {
      router.back();
    }
  }
}

</script>

<style>

html, body {
  margin: 0;
  padding:0;
  color: #2c3e50;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar {
  margin: 0em 1em; 
}

</style>
