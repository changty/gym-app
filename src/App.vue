<template>
<div class="header">
  <div v-if="$route.name !== 'home'">
  <button @click="back">Back</button>
  </div>
  <h1>Gym app</h1>
  <div v-if="sharedState.isLoggedIn">
    <button @click="signOut">Logout</button>
  </div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.header {
  display: flex; 
  align-content: flex-end;
  justify-content: center; 
  flex-direction: row;
}

</style>
