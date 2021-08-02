<template>
  <h1>Gym app</h1>
  <div v-if="sharedState.isLoggedIn">
    <button @click="signOut">Logout</button>
  </div>
   <router-view></router-view>
  
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
