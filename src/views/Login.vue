
<template>
   <h1>Login</h1>
    <button @click="googleSignIn">
      Login In with Google
    </button>
</template>

<script>
import firebase from "firebase";
import router from '../router';
    export default {
        data() {
            return {
            }
        },
        methods: {
            googleSignIn() {
                let provider = new firebase.auth.GoogleAuthProvider();
                firebase
                        .auth()
                        .signInWithPopup(provider)
                        .then((result) => {
                            // let token = result.credential.accessToken;
                            // let user = result.user;
                            let name = result.user.displayName; 
                            let email = result.user.email; 
                            console.log(name, email) // Token
                            router.push('/');
                        })
                        .catch((err) => {
                             console.log(err); // This will give you all the information needed to further debug any errors
                        });
            }
        }
    }
</script>
