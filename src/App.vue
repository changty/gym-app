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
    color: rgb(241,241,241);
}

html, body {
  margin: 0;
  padding:0;
  color: rgb(241,241,241);
  background: #000 !important;
  padding-bottom: 2rem;
  margin-bottom: 60px; 
}
.navbar {
  background: #000;
  color: rgb(241,241,241);
  padding: 0rem 1rem;
  height: 60px; 
  margin-bottom: 1rem; 
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
}

.card {
  background: rgb(26,25,32) !important; 
  color: rgb(241,241,241);
  border: 0px solid white; 
  border-radius: 1rem !important;
  padding: 1.25rem 1.5rem;
}

 @media only screen and (max-width: 400px) {
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
  color:rgba(117,117,108) !important;
}

button.btn {
  border-radius: 3rem !important;
  font-weight: bold !important; 
  padding: .75rem 1.5rem !important;
}
.btn-link {
    color: rgb(241,241,241) !important;

}
.btn-primary {
  background: rgb(106,205,165) !important;
  border:1px solid rgb(106,205,165) !important; 
}

.btn-outline-primary {
    border:1px solid rgb(106,205,165) !important; 
    background: none; 
    color: rgb(241,241,241) !important;
}
.btn-outline-primary:hover {
  background: rgb(106,205,165) !important; 
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

.card-primary .btn-primary {
  background: #fff !important; 
  color: rgb(106,205,165) !important; 
} 
.card-primary .btn-outline-primary {
  border-color: #fff !important; 
} 
.card-primary .btn-outline-primary:hover {
  background: #fff !important; 
  color: rgb(106,205,165) !important; 
}

.card-primary {
  background: rgb(106,205,165) !important; 
}

input.form-control,
textarea.form-control {
  background: rgb(44,42,51) !important;
  border: 1px solid black !important;
  color: rgb(241,241,241) !important;

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
  background: #6acda5 !important; 
  color: rgb(241,241,241) !important;;
}

.blue {
  background: #6aaacd !important;; 
  color: rgb(241,241,241) !important;;
}

.red {
  background: #cd6a92 !important;; 
  color: rgb(241,241,241) !important;;
}
.yellow {
  background: #cda56a !important;; 
  color: rgb(241,241,241) !important;;
}

.green-txt {
  color: #6acda5 !important; 
}

.blue-txt {
  color: #6aaacd !important;; 
}

.red-txt {
  color: #cd6a92 !important;; 
}
.yellow-txt {
  color: #cda56a !important;; 
}
</style>
