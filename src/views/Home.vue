<template>
   <h1>Home - {{ user.displayName }}</h1>
</template>

<script>

import firebase from "firebase";

console.log(firebase.auth().currentUser)

    export default {
        data() {
            return {
                user: {displayName: "", email: ""}
            }
        },

        mounted() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    console.log(user);
                    this.user = user; 
                }
            })
        }
       
    }
</script>
