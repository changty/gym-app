<template>
<nav class="navbar navbar-expand-lg justify-content-between align-items-center">
  <div v-if="$route.name !== 'home' && $route.name !== 'login'  ">
    <button class="btn btn-outline-light text-light btn-sm" @click="back">Back</button>
  </div>
  <div v-if="$route.name === 'home'">
    <!-- placeholder -->
  </div>


  <h5 style="text-align: center; padding:0; margin:0; width: auto; flex-grow: 1;">Gym app</h5>
  <div v-if="sharedState.isLoggedIn && $route.name !== 'login'">
    <button @click="signOut" class="btn btn-outline-danger btn-sm">Logout</button>
  </div>
</nav>

<div class="container">
   <router-view></router-view>
</div>
  
<!-- <div class="footer">
  asdf
</div> -->
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
    workouts: [],
    weightUnit: "kg"
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
          router.push('/login');
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

h1,h2,h3,h4,h5,h6,p {
  color: rgba(255,255,255,.87);
}

html, body {
  margin: 0;
  padding:0;
  color: rgba(255,255,255,.87);
  background: #121212 !important;
  padding-bottom: 2rem;
  margin-bottom: 60px; 
}
.navbar {
  background:#121212 ;
  color: rgba(255,255,255,.87);
  padding: 0rem 1rem;
  height: 60px; 
  margin-bottom: 1rem; 
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #121212;
}

.card {
  background: rgba(255,255,255, .05) !important; 
  color: rgba(255,255,255,.87);
  border: 0px solid white; 
  border-radius: 1rem !important;
  padding: 1.25rem 1.5rem;
}

.card label {
  color: rgba(255,255,255,.6) !important;
}

.card.lift {
  background: rgba(255,255,255,.12) !important;
}

.badge {
  height: 36px; 
  padding-top: 12px !important;
}
 @media only screen and (max-width: 600px) {
   .card {
     padding: .25rem .25rem;
     font-size: 13px !important; 
   }

   .badge {
     font-size: 12px !important; 
     width: 60px !important; 
   }
 }


.text-muted {
    color: rgba(255,255,255,.6);
}

button.btn {
  border-radius: 3rem !important;
  font-weight: bold !important; 
  padding: .75rem 1.5rem !important;
}
.btn-link {
    color: rgba(255,255,255,.87) !important;

}
.btn-primary {
  background: rgb(122,222,196) !important;
  border:1px solid rgb(122,222,196) !important; 
  color: #121212 !important;
}

.btn-outline-primary {
    border:1px solid rgb(122,222,196) !important; 
    background: none; 
    color: rgba(255,255,255,.87) !important;
}
.btn-outline-primary:hover {
  background: rgb(122,222,196) !important; 
}

button.btn.icon-only-rounded {
  width: 3rem !important; 
  height: 3rem !important; 
  border-radius: 100%;
  font-size: 25px !important;
  line-height: 1.5rem !important; 
  padding: 0px !important
}

button.btn.icon-only-rounded.btn-sm {
  width: 2rem !important; 
  height: 2rem !important; 
  font-size: 16px !important; 
  line-height: .5rem !important; 
}

.card.green .btn-primary {
  background: #fff !important; 
  color: rgb(122,222,196) !important; 
} 
.card.green .btn-outline-primary {
  border-color: #fff !important; 
} 
.card.green .btn-outline-primary:hover {
  background: #fff !important; 
  color: rgb(122,222,196) !important; 
}

input.form-control,
textarea.form-control {
  background: rgb(44,42,51) !important;
  border: 1px solid black !important;
  color: rgba(255,255,255,.87) !important;

}
.footer {
  position: fixed; 
  bottom: 0; 
  left: 0; 
  right: 0; 
  width: 100%; 
  height: 60px; 
  background: black; 
}

.green {
  background: rgb(122,222,196) !important; 
  color: rgba(255,255,255,.87) !important;
  color: #121212 !important;
}

.blue {
  background: #6aaacd !important;; 
  color: rgba(255,255,255,.87) !important;
  color: #121212 !important;
}

.btn.red {
  border-color: #cd6a92 !important; 
}

.red {
  background: #cd6a92 !important;
  color: rgba(255,255,255,.87) !important;
  color: #121212 !important;
}
.yellow {
  background: #cda56a !important;
  color: rgba(255,255,255,.87) !important;
  color: #121212 !important;
}

.white {
    color: #121212 !important; 
    background: rgba(255,255,255,.87) !important;
    border-color: rgba(255,255,255,.87) !important
}


.green-txt,
.green-txt h1,
.green-txt h2, 
.green-txt h3,
.green-txt h4,
.green-txt h5,
.green-txt p {
  color: rgb(122,222,196) !important; 
}

.blue-txt,
.blue-txt h1,
.blue-txt h2, 
.blue-txt h3,
.blue-txt h4,
.blue-txt h5,
.blue-txt p {
  color: #6aaacd !important;; 
}

.red-txt,
.red-txt h1,
.red-txt h2, 
.red-txt h3,
.red-txt h4,
.red-txt h5,
.red-txt p {
  color: #cd6a92 !important;; 
}
.yellow-txt,
.yellow-txt h1,
.yellow-txt h2, 
.yellow-txt h3,
.yellow-txt h4,
.yellow-txt h5,
.yellow-txt p {
  color: #cda56a !important;; 
}

.pointer {
  cursor: pointer;
}
.dark-text {
   color: #121212 !important;

}
.link {
  text-decoration: underline;
  cursor:pointer;
}
</style>
