
<template>
<br/><br/>
   <h1 class="text-center">Login to get started</h1>
   <br/>
    <!-- <button @click="googleSignIn">
      Login In with Google
    </button> -->

    <div class="d-flex justify-content-center">

            <a @click="googleSignIn" href="#" class="btn btn-outline-dark login-button" role="button" style="text-transform:none">
                <img style="width: 35px; margin-bottom:3px; margin-right:5px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                Login with Google
            </a>

    </div>
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

<style scoped>
.login-button {

    font-size: 30px;
    width: 350px !important;
    background: white;
}
.login-button:hover {
    color: #333;
}
</style>